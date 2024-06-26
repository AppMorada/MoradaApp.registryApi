import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../../consts';
import { DataSource } from 'typeorm';
import {
	EmployeeMemberReadOps,
	EmployeeMemberRepoReadOpsInterfaces,
} from '@app/repositories/employeeMember/read';
import { TypeOrmUserMapper } from '../../../mapper/user';
import { TypeOrmUserEntity } from '../../../entities/user.entity';
import { TypeOrmCondominiumMemberMapper } from '../../../mapper/condominiumMember';
import { TypeOrmUniqueRegistryEntity } from '../../../entities/uniqueRegistry.entity';
import { TypeOrmUniqueRegistryMapper } from '../../../mapper/uniqueRegistry';
import { TypeOrmCondominiumMemberEntity } from '../../../entities/condominiumMember.entity';
import { IUserInObject } from '@app/mapper/user';
import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmEmployeeMemberGetByUserId
implements EmployeeMemberReadOps.GetByUserId
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	private reorganizeCondominiumMemberInfos(
		input: TypeOrmCondominiumMemberEntity[],
	) {
		let user: IUserInObject | undefined;
		let uniqueRegistry: IUniqueRegistryInObject | undefined;

		const condominiumMemberInfos = input.map((item) => {
			const typeOrmUser = item.user as TypeOrmUserEntity;
			const typeOrmUniqueRegistry =
				item.uniqueRegistry as TypeOrmUniqueRegistryEntity;

			if (!user) user = TypeOrmUserMapper.toObject(typeOrmUser);

			if (!uniqueRegistry)
				uniqueRegistry = TypeOrmUniqueRegistryMapper.toObject(
					typeOrmUniqueRegistry,
				);

			const parsedCondominiumMember =
				TypeOrmCondominiumMemberMapper.toObject(item) as any;
			delete parsedCondominiumMember.uniqueRegistryId;
			delete parsedCondominiumMember.userId;

			return parsedCondominiumMember;
		});

		return { user, uniqueRegistry, condominiumMemberInfos };
	}

	async exec(
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

		const {
			uniqueRegistry,
			user,
			condominiumMemberInfos: worksOn,
		} = this.reorganizeCondominiumMemberInfos(raw);

		return worksOn.length > 0
			? {
				worksOn,
				user: {
					id: user!.id!,
					name: user!.name!,
					tfa: user!.tfa!,
					phoneNumber: user?.phoneNumber,
					createdAt: user!.createdAt!,
					updatedAt: user!.updatedAt!,
				},
				uniqueRegistry: uniqueRegistry!,
			}
			: undefined;
	}
}
