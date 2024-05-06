import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../../consts';
import { DataSource } from 'typeorm';
import { TypeOrmCondominiumMemberMapper } from '../../../mapper/condominiumMember';
import {
	CommunityMemberWriteOps,
	CommunityMemberRepoWriteOpsInterfaces,
} from '@app/repositories/communityMember/write';
import { TypeOrmCommunityInfoMapper } from '../../../mapper/communityInfo';
import { TypeOrmUniqueRegistryEntity } from '../../../entities/uniqueRegistry.entity';
import { TypeOrmUniqueRegistryMapper } from '../../../mapper/uniqueRegistry';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmCommunityMemberCreateMany
implements CommunityMemberWriteOps.CreateMany
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: CommunityMemberRepoWriteOpsInterfaces.createMany,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create new community member');

		await this.dataSource.transaction(async (t) => {
			for (let i = 0; i < input.members.length; i++) {
				span.setAttribute('Member ID', i);
				const { rawUniqueRegistry, communityInfos, content } =
					input.members[i];

				let typeOrmUniqueRegistry = await t
					.getRepository(TypeOrmUniqueRegistryEntity)
					.findOne({
						where: {
							email: rawUniqueRegistry.email.value,
						},
						loadRelationIds: {
							relations: ['user'],
						},
					});

				const member =
					TypeOrmCondominiumMemberMapper.toTypeOrm(content);

				if (!typeOrmUniqueRegistry) {
					const uniqueRegistry = new UniqueRegistry({
						email: rawUniqueRegistry.email.value,
					});
					typeOrmUniqueRegistry =
						TypeOrmUniqueRegistryMapper.toTypeOrm(uniqueRegistry);

					await t.insert('unique_registries', typeOrmUniqueRegistry);
				}

				member.uniqueRegistry = typeOrmUniqueRegistry.id;
				const communityInfo =
					TypeOrmCommunityInfoMapper.toTypeOrm(communityInfos);

				await t.insert('condominium_members', member);
				await t.insert('community_infos', communityInfo);
			}
		});

		span.end();
	}
}
