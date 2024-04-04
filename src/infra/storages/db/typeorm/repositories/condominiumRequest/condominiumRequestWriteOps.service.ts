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

@Injectable()
export class TypeOrmCondominiumRequestWriteOps
implements CondominiumRequestRepoWriteOps
{
	constructor(
		@Inject(typeORMConsts.entity.condominiumsRequests)
		private readonly requestRepo: Repository<TypeOrmCondominiumRequestEntity>,
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

			if (!user)
				throw new DatabaseCustomError({
					tag: DatabaseCustomErrorsTags.contentDoesntExists,
					message:
						'Usuário não solicitou a sua entrada no condomínio',
				});

			const condominiumMember = TypeOrmCondominiumMemberMapper.toTypeOrm(
				input.condominiumMember,
			);
			condominiumMember.uniqueRegistry = user.uniqueRegistry;
			const communityInfo = TypeOrmCommunityInfoMapper.toTypeOrm(
				input.communityInfo,
			);

			await t.insert('condominium_members', condominiumMember);
			await t.insert('community_infos', communityInfo);
			await t
				.getRepository(TypeOrmCondominiumRequestEntity)
				.delete({ user: user.id });
		});

		span.end();
	}

	async create(input: CondominiumRequestRepoWriteOpsInterfaces.create) {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create condominium request');

		if (input.request.userId.equalTo(input.condominium.ownerId))
			throw new DatabaseCustomError({
				message: 'Usuário já está participando do condomínio',
				tag: DatabaseCustomErrorsTags.contentAlreadyExists,
			});

		await this.dataSource.transaction(async (t) => {
			const condominiumMember = await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.findOne({
					where: {
						user: {
							id: input.request.userId.value,
						},
						condominium: {
							id: input.request.condominiumId.value,
						},
					},
				});
			if (condominiumMember)
				throw new DatabaseCustomError({
					message: 'Usuário já está participando do condomínio',
					tag: DatabaseCustomErrorsTags.contentAlreadyExists,
				});

			const parsedData = TypeOrmCondominiumRequestMapper.toTypeOrm(
				input.request,
			);
			await t
				.getRepository(TypeOrmCondominiumRequestEntity)
				.insert(parsedData);
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

		span.end();
	}
}
