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
import { TypeOrmCommunityInfosEntity } from '../../../entities/communityInfos.entity';

@Injectable()
export class TypeOrmCommunityMemberGetByUserIdAndCondominiumId
implements CommunityMemberReadOps.GetByUserIdAndCondominiumId
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: CommunityMemberRepoReadOpsInterfaces.getByUserIdAndCondominiumId,
	): Promise<
		| CommunityMemberRepoReadOpsInterfaces.getByUserIdAndCondominiumIdReturn
		| undefined
	> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute(
			'op.description',
			'Checking community member based on user and condominium id',
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
				user_id: input.userId.value,
			})
			.andWhere('condominium_member.condominium_id = :condominium_id', {
				condominium_id: input.condominiumId.value,
			})
			.andWhere('condominium_member.role = 0')
			.loadAllRelationIds({
				relations: ['uniqueRegistry', 'user', 'condominium'],
			})
			.getOne();

		span.end();

		if (!raw) return undefined;

		const condominiumMember = TypeOrmCondominiumMemberMapper.toClass(raw);

		const typeOrmCommunityInfos =
			raw?.communityInfos as TypeOrmCommunityInfosEntity;
		typeOrmCommunityInfos.member = condominiumMember.id.value;
		const communityInfos = TypeOrmCommunityInfoMapper.toClass(
			raw.communityInfos,
		);

		return {
			member: condominiumMember,
			communityInfos,
		};
	}
}
