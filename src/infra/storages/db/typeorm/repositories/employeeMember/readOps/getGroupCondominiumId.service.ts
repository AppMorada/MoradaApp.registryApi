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
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmEmployeeMemberGetGroupByCondominiumId
implements EmployeeMemberReadOps.GetGroupByCondominiumId
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
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
				TypeOrmCondominiumMemberMapper.toObject(item) as any;
			delete condominiumMemberInfos.userId;
			delete condominiumMemberInfos.uniqueRegistryId;

			const userAsObjt = TypeOrmUserMapper.toObject(typeOrmUser) as any;
			delete userAsObjt.password;
			delete userAsObjt.uniqueRegistryId;

			return { user: userAsObjt, uniqueRegistry, condominiumMemberInfos };
		});
	}
}
