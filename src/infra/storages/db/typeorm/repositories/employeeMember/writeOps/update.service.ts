import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../../consts';
import { DataSource } from 'typeorm';
import {
	EmployeeMemberWriteOps,
	EmployeeMemberRepoWriteOpsInterfaces,
} from '@app/repositories/employeeMember/write';
import { TypeOrmUserEntity } from '../../../entities/user.entity';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmEmployeeMemberUpdate
implements EmployeeMemberWriteOps.Update
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: EmployeeMemberRepoWriteOpsInterfaces.update,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Update employee');

		const modifications = {
			name: input.name?.value,
			phoneNumber: input.phoneNumber?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		if (modifications.name || modifications.phoneNumber)
			await this.dataSource
				.getRepository(TypeOrmUserEntity)
				.createQueryBuilder()
				.innerJoin(
					'condominium_members',
					'a',
					'a.condominium_id = :condominiumId',
					{ condominiumId: input.condominiumId.value },
				)
				.update('users')
				.set(modifications)
				.where('id = :userId', { userId: input.userId.value })
				.execute();

		span.end();
	}
}
