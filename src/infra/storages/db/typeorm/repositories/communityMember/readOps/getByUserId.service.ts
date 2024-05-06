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
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmCommunityMemberGetByUserId
implements CommunityMemberReadOps.GetByUserId
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: CommunityMemberRepoReadOpsInterfaces.getByUserId,
	): Promise<CommunityMemberRepoReadOpsInterfaces.getByUserIdReturn[]> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);

		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute(
			'op.description',
			'Get community member based on user id',
		);

		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.innerJoinAndSelect(
				'condominium_member.communityInfos',
				'a',
				'a.member_id = condominium_member.id',
			)
			.where('condominium_member.user_id = :user_id', {
				user_id: input.id.value,
			})
			.andWhere('condominium_member.role = 0')
			.loadAllRelationIds({
				relations: ['condominium', 'user', 'uniqueRegistry'],
			})
			.getMany();

		span.end();

		return raw.map((item) => {
			const member = TypeOrmCondominiumMemberMapper.toObject(item) as any;
			delete member.userId;
			delete member.uniqueRegistryId;

			const communityInfos = TypeOrmCommunityInfoMapper.toObject(
				item.communityInfos,
			) as any;
			delete communityInfos.memberId;

			return {
				member,
				communityInfos,
			};
		});
	}
}
