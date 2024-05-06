import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../../consts';
import { DataSource } from 'typeorm';
import { TypeOrmCondominiumMemberEntity } from '../../../entities/condominiumMember.entity';
import {
	CommunityMemberWriteOps,
	CommunityMemberRepoWriteOpsInterfaces,
} from '@app/repositories/communityMember/write';
import { TypeOrmUniqueRegistryEntity } from '../../../entities/uniqueRegistry.entity';
import { TypeOrmUserEntity } from '../../../entities/user.entity';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmCommunityMemberRemove
implements CommunityMemberWriteOps.Remove
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: CommunityMemberRepoWriteOpsInterfaces.remove,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Remove community member');

		await this.dataSource.transaction(async (t) => {
			const member = await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.findOne({
					where: {
						id: input.id.value,
					},
					loadRelationIds: true,
				});
			if (!member) return;

			const userExists = await t.getRepository(TypeOrmUserEntity).exist({
				where: {
					uniqueRegistry: {
						id: member.uniqueRegistry as string,
					},
				},
			});
			if (!userExists)
				await t
					.getRepository(TypeOrmUniqueRegistryEntity)
					.delete({ id: member.uniqueRegistry as string });

			await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.delete({ id: member.id });
		});

		span.end();
	}
}
