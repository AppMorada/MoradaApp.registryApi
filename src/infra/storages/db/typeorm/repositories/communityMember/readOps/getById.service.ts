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
export class TypeOrmCommunityMemberGetById
implements CommunityMemberReadOps.GetById
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: CommunityMemberRepoReadOpsInterfaces.getById,
	): Promise<CommunityMemberRepoReadOpsInterfaces.getByIdReturn | undefined> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute(
			'op.description',
			'Get community member based on your own id',
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
			.where('condominium_member.id = :id', { id: input.id.value })
			.andWhere('condominium_member.role = 0')
			.loadAllRelationIds({
				relations: ['condominium', 'user'],
			})
			.getOne();

		span.end();

		if (!raw) return undefined;

		const rawUniqueRegistry =
			raw.uniqueRegistry as TypeOrmUniqueRegistryEntity;
		const uniqueRegistry =
			TypeOrmUniqueRegistryMapper.toObject(rawUniqueRegistry);

		const member = TypeOrmCondominiumMemberMapper.toObject(raw) as any;
		delete member.uniqueRegistryId;

		const communityInfos = TypeOrmCommunityInfoMapper.toObject(
			raw.communityInfos,
		) as any;
		delete communityInfos.memberId;

		return { member, communityInfos, uniqueRegistry };
	}
}
