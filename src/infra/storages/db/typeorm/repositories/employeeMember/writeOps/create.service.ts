import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../../consts';
import { DataSource } from 'typeorm';
import {
	EmployeeMemberWriteOps,
	EmployeeMemberRepoWriteOpsInterfaces,
} from '@app/repositories/employeeMember/write';
import { TypeOrmUserMapper } from '../../../mapper/user';
import { TypeOrmCondominiumMemberMapper } from '../../../mapper/condominiumMember';
import { TypeOrmUniqueRegistryMapper } from '../../../mapper/uniqueRegistry';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmEmployeeMemberCreate
implements EmployeeMemberWriteOps.Create
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: EmployeeMemberRepoWriteOpsInterfaces.create,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create employee');

		await this.dataSource.transaction(async (t) => {
			const uniqueRegistry = new UniqueRegistry({
				email: input.rawUniqueRegistry.email.value,
				CPF: input.rawUniqueRegistry.CPF.value,
			});
			const member = TypeOrmCondominiumMemberMapper.toTypeOrm(
				input.member,
			);
			const user = TypeOrmUserMapper.toTypeOrm(input.user);
			user.uniqueRegistry = uniqueRegistry.id.value;
			member.uniqueRegistry = uniqueRegistry.id.value;

			await t.insert(
				'unique_registries',
				TypeOrmUniqueRegistryMapper.toTypeOrm(uniqueRegistry),
			);
			await t.insert('users', user);
			await t.insert('condominium_members', member);
		});

		span.end();
	}
}
