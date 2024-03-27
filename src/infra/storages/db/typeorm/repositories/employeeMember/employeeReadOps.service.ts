import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../consts';
import { DataSource } from 'typeorm';
import {
	EmployeeMemberRepoReadOps,
	EmployeeMemberRepoReadOpsInterfaces,
} from '@app/repositories/employeeMember/read';
import { TypeOrmUserMapper } from '../../mapper/user';
import { TypeOrmUserEntity } from '../../entities/user.entity';
import { TypeOrmCondominiumMemberMapper } from '../../mapper/condominiumMember';
import { TypeOrmUniqueRegistryEntity } from '../../entities/uniqueRegistry.entity';
import { TypeOrmUniqueRegistryMapper } from '../../mapper/uniqueRegistry';
import { TypeOrmCondominiumMemberEntity } from '../../entities/condominiumMember.entity';
import { IUserInObject } from '@app/mapper/user';
import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmEmployeeMemberRepoReadOps
implements EmployeeMemberRepoReadOps
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async getByUserId(
		input: EmployeeMemberRepoReadOpsInterfaces.getByUserId,
	): Promise<
		EmployeeMemberRepoReadOpsInterfaces.getByUserIdReturn | undefined
	> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute('op.description', 'Get employee based on user id');

		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.innerJoinAndSelect(
				'condominium_member.user',
				'a',
				'a.id = condominium_member.user_id',
			)
			.innerJoinAndSelect('condominium_member.uniqueRegistry', 'b')
			.where('condominium_member.user_id = :id', {
				id: input.id.value,
			})
			.andWhere('condominium_member.role = 1')
			.loadAllRelationIds({
				relations: ['condominium'],
			})
			.getMany();

		span.end();

		if (!raw) return undefined;

		let user: IUserInObject | undefined;
		let uniqueRegistry: IUniqueRegistryInObject | undefined;

		const worksOn = raw.map((item) => {
			const typeOrmUser = item.user as TypeOrmUserEntity;
			const typeOrmUniqueRegistry =
				item.uniqueRegistry as TypeOrmUniqueRegistryEntity;

			if (!user) {
				user = TypeOrmUserMapper.toObject(typeOrmUser);
				user.uniqueRegistryId = typeOrmUniqueRegistry.id;
			}
			if (!uniqueRegistry)
				uniqueRegistry = TypeOrmUniqueRegistryMapper.toObject(
					typeOrmUniqueRegistry,
				);

			item.user = typeOrmUser.id;
			item.uniqueRegistry = typeOrmUniqueRegistry.id;

			return TypeOrmCondominiumMemberMapper.toObject(item);
		});

		return worksOn.length > 0
			? {
				worksOn,
				user: user!,
				uniqueRegistry: uniqueRegistry!,
			}
			: undefined;
	}

	async getGroupCondominiumId(
		input: EmployeeMemberRepoReadOpsInterfaces.getByCondominiumId,
	): Promise<EmployeeMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[]> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute(
			'op.description',
			'Get employee group based on condominium id',
		);

		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumMemberEntity)
			.createQueryBuilder('condominium_member')
			.innerJoinAndSelect(
				'condominium_member.user',
				'a',
				'a.id = condominium_member.user_id',
			)
			.innerJoinAndSelect('condominium_member.uniqueRegistry', 'b')
			.where('condominium_member.condominium_id = :condominiumId', {
				condominiumId: input.condominiumId.value,
			})
			.andWhere('condominium_member.role = 1')
			.loadAllRelationIds({
				relations: ['condominium'],
			})
			.getMany();

		span.end();

		return raw.map((item) => {
			const typeOrmUser = item.user as TypeOrmUserEntity;
			const typeOrmUniqueRegistry =
				item.uniqueRegistry as TypeOrmUniqueRegistryEntity;

			const uniqueRegistry = TypeOrmUniqueRegistryMapper.toObject(
				typeOrmUniqueRegistry,
			);
			const condominiumMemberInfos =
				TypeOrmCondominiumMemberMapper.toObject(item);
			condominiumMemberInfos.uniqueRegistryId = uniqueRegistry.id;
			condominiumMemberInfos.userId = typeOrmUser.id;

			const userAsObjt = TypeOrmUserMapper.toObject(typeOrmUser) as any;
			userAsObjt.uniqueRegistryId = uniqueRegistry.id;
			delete userAsObjt.password;
			delete userAsObjt.tfa;

			return { user: userAsObjt, uniqueRegistry, condominiumMemberInfos };
		});
	}
}
