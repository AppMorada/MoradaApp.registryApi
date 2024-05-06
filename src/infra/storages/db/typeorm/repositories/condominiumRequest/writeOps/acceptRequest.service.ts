import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmCondominiumRequestEntity } from '../../../entities/condominiumRequest.entity';
import { typeORMConsts } from '../../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import {
	CondominiumRequestRepoWriteOpsInterfaces,
	CondominiumRequestWriteOps,
} from '@app/repositories/condominiumRequest/write';
import { TypeOrmCommunityInfoMapper } from '../../../mapper/communityInfo';
import { TypeOrmCondominiumMemberEntity } from '../../../entities/condominiumMember.entity';
import { CommunityInfos } from '@app/entities/communityInfos';
import { TypeOrmCommunityInfosEntity } from '../../../entities/communityInfos.entity';
import {
	DatabaseCustomError,
	DatabaseCustomErrorsTags,
} from '@infra/storages/db/error';

@Injectable()
export class TypeOrmCondominiumRequestAcceptRequest
implements CondominiumRequestWriteOps.AcceptRequest
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
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
			const rawCondominiumMember = await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.findOne({
					where: {
						user: {
							id: input.userId.value,
						},
						condominium: {
							id: input.condominiumId.value,
						},
					},
				});
			if (!rawCondominiumMember)
				throw new DatabaseCustomError({
					tag: DatabaseCustomErrorsTags.contentDoesntExists,
					message: 'Usuário não foi convidado para o condomínio',
				});

			const communityInfo = TypeOrmCommunityInfoMapper.toTypeOrm(
				new CommunityInfos({ memberId: rawCondominiumMember.id }),
			);

			await t.getRepository(TypeOrmCondominiumMemberEntity).update(
				{
					user: input.userId.value,
					condominium: input.condominiumId.value,
					role: -1,
				},
				{ role: 0 },
			);

			await t
				.getRepository(TypeOrmCommunityInfosEntity)
				.insert(communityInfo);

			await t.getRepository(TypeOrmCondominiumRequestEntity).delete({
				user: input.userId.value,
				condominium: input.condominiumId.value,
			});
		});

		span.end();
	}
}
