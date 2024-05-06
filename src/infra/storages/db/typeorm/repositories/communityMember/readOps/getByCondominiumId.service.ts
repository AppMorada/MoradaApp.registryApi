import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../../consts';
import { DataSource } from 'typeorm';
import { TypeOrmCondominiumMemberEntity } from '../../../entities/condominiumMember.entity';
import { TypeOrmCondominiumMemberMapper } from '../../../mapper/condominiumMember';
import {
	CommunityMemberReadOps,
	CommunityMemberRepoReadOpsInterfaces,
} from '@app/repositories/communityMember/read';
import { TypeOrmCommunityInfoMapper } from '../../../mapper/communityInfo';
import { TypeOrmUniqueRegistryEntity } from '../../../entities/uniqueRegistry.entity';
import { TypeOrmUniqueRegistryMapper } from '../../../mapper/uniqueRegistry';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmCommunityMemberGetByCondominiumId
implements CommunityMemberReadOps.GetByCondominiumId
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: CommunityMemberRepoReadOpsInterfaces.getByCondominiumId,
	): Promise<
		CommunityMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[]
	> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute(
			'op.description',
			'Get community member group based on condominium id',
		);

		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.innerJoinAndSelect(
				'condominium_member.communityInfos',
				'a',
				'a.member_id = condominium_member.id',
			)
			.innerJoinAndSelect('condominium_member.uniqueRegistry', 'b')
			.where('condominium_member.condominium_id = :condominium_id', {
				condominium_id: input.condominiumId.value,
			})
			.andWhere('condominium_member.role = 0')
			.loadAllRelationIds({
				relations: ['condominium', 'user'],
			})
			.getMany();

		span.end();

		return raw.map((item) => {
			const uniqueRegistry = TypeOrmUniqueRegistryMapper.toObject(
				item.uniqueRegistry as TypeOrmUniqueRegistryEntity,
			);

			const member = TypeOrmCondominiumMemberMapper.toObject(item) as any;
			delete member.uniqueRegistryId;

			const communityInfos = TypeOrmCommunityInfoMapper.toObject(
				item.communityInfos,
			) as any;
			delete communityInfos.memberId;

			return { member, communityInfos, uniqueRegistry };
		});
	}
}
