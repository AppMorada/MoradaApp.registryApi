import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../consts';
import { DataSource } from 'typeorm';
import { TypeOrmCondominiumMemberEntity } from '../../entities/condominiumMember.entity';
import { TypeOrmCondominiumMemberMapper } from '../../mapper/condominiumMember';
import {
	CommunityMemberRepoReadOps,
	CommunityMemberRepoReadOpsInterfaces,
} from '@app/repositories/communityMember/read';
import { TypeOrmCommunityInfoMapper } from '../../mapper/communityInfo';
import { TypeOrmUniqueRegistryEntity } from '../../entities/uniqueRegistry.entity';
import { TypeOrmUniqueRegistryMapper } from '../../mapper/uniqueRegistry';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmCommunityMemberRepoReadOps
implements CommunityMemberRepoReadOps
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async checkByUserAndCondominiumId(
		input: CommunityMemberRepoReadOpsInterfaces.getByUserIdAndCondominiumId,
	): Promise<number> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute(
			'op.description',
			'Checking community member based on user and condominium id',
		);

		const count = await this.dataSource
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
			.getCount();

		span.end();

		return count;
	}

	async getByUserId(
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
			const member = TypeOrmCondominiumMemberMapper.toObject(item);
			const communityInfos = TypeOrmCommunityInfoMapper.toObject(
				item.communityInfos,
			);
			communityInfos.memberId = member.id;

			return { member, communityInfos };
		});
	}

	async getById(
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
			TypeOrmUniqueRegistryMapper.toClass(rawUniqueRegistry);
		raw.uniqueRegistry = uniqueRegistry.id.value;

		const member = TypeOrmCondominiumMemberMapper.toClass(raw);
		raw.communityInfos.member = member.id.value;

		const communityInfos = TypeOrmCommunityInfoMapper.toClass(
			raw.communityInfos,
		);

		return { member, communityInfos, uniqueRegistry };
	}

	async getGroupCondominiumId(
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
			item.uniqueRegistry = uniqueRegistry.id;

			const member = TypeOrmCondominiumMemberMapper.toObject(item);
			const communityInfos = TypeOrmCommunityInfoMapper.toObject(
				item.communityInfos,
			);

			return { member, communityInfos, uniqueRegistry };
		});
	}
}
