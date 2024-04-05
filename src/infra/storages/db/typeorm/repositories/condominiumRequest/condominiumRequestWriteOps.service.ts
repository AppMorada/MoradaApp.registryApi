import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmCondominiumRequestEntity } from '../../entities/condominiumRequest.entity';
import { typeORMConsts } from '../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { TypeOrmCondominiumRequestMapper } from '../../mapper/condominiumRequest';
import {
	CondominiumRequestRepoWriteOps,
	CondominiumRequestRepoWriteOpsInterfaces,
} from '@app/repositories/condominiumRequest/write';
import { TypeOrmCondominiumMemberMapper } from '../../mapper/condominiumMember';
import { TypeOrmCommunityInfoMapper } from '../../mapper/communityInfo';
import {
	DatabaseCustomError,
	DatabaseCustomErrorsTags,
} from '@infra/storages/db/error';
import { TypeOrmUserEntity } from '../../entities/user.entity';
import { TypeOrmCondominiumMemberEntity } from '../../entities/condominiumMember.entity';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { CommunityInfos } from '@app/entities/communityInfos';
import { TypeOrmCommunityInfosEntity } from '../../entities/communityInfos.entity';

@Injectable()
export class TypeOrmCondominiumRequestWriteOps
implements CondominiumRequestRepoWriteOps
{
	constructor(
		@Inject(typeORMConsts.entity.condominiumsRequests)
		private readonly requestRepo: Repository<TypeOrmCondominiumRequestEntity>,
		@Inject(typeORMConsts.entity.condominiumMember)
		private readonly condominiumMemberRepo: Repository<TypeOrmCondominiumMemberEntity>,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async acceptRequest(
		input: CondominiumRequestRepoWriteOpsInterfaces.accept,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute(
			'op.description',
			'Accept condominium request and create new condominium member',
		);

		await this.dataSource.transaction(async (t) => {
			const user = await t
				.getRepository(TypeOrmUserEntity)
				.createQueryBuilder('user')
				.innerJoinAndSelect('user.condominiumRequest', 'a')
				.loadAllRelationIds({
					relations: ['uniqueRegistry'],
				})
				.where('user.id = :id', { id: input.userId.value })
				.getOne();

			const condominiumMember = await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.findOne({
					where: {
						user: { id: input.userId.value },
						condominium: { id: input.condominiumId.value },
					},
					loadRelationIds: true,
				});

			if (!user || !condominiumMember)
				throw new DatabaseCustomError({
					tag: DatabaseCustomErrorsTags.contentDoesntExists,
					message:
						'Usuário não solicitou a sua entrada no condomínio',
				});

			const communityInfo = TypeOrmCommunityInfoMapper.toTypeOrm(
				new CommunityInfos({ memberId: condominiumMember.id }),
			);

			await t.getRepository(TypeOrmCondominiumMemberEntity).update(
				{
					user: input.userId.value,
					condominium: input.condominiumId.value,
				},
				{ role: 0 },
			);

			await t
				.getRepository(TypeOrmCommunityInfosEntity)
				.insert(communityInfo);

			await t.getRepository(TypeOrmCondominiumRequestEntity).delete({
				user: user.id,
				condominium: input.condominiumId.value,
			});
		});

		span.end();
	}

	async create(input: CondominiumRequestRepoWriteOpsInterfaces.create) {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create condominium request');

		await this.dataSource.transaction(async (t) => {
			const requesterCondominiumMember =
				TypeOrmCondominiumMemberMapper.toTypeOrm(
					new CondominiumMember({
						condominiumId: input.request.condominiumId.value,
						userId: input.request.userId.value,
						uniqueRegistryId: input.request.uniqueRegistryId.value,
						role: -1,
					}),
				);
			const condominiumRequest =
				TypeOrmCondominiumRequestMapper.toTypeOrm(input.request);

			await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.insert(requesterCondominiumMember);
			await t
				.getRepository(TypeOrmCondominiumRequestEntity)
				.insert(condominiumRequest);
		});

		span.end();
	}

	async removeByUserIdAndCondominiumId(
		input: CondominiumRequestRepoWriteOpsInterfaces.remove,
	) {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Delete condominium request');

		await this.requestRepo.delete({
			user: input.userId.value,
			condominium: input.condominiumId.value,
		});
		await this.condominiumMemberRepo.delete({
			user: input.userId.value,
			condominium: input.condominiumId.value,
		});

		span.end();
	}
}
