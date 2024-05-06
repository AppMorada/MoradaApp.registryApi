import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../../consts';
import { DataSource } from 'typeorm';
import {
	EmployeeMemberWriteOps,
	EmployeeMemberRepoWriteOpsInterfaces,
} from '@app/repositories/employeeMember/write';
import { TypeOrmUserEntity } from '../../../entities/user.entity';
import {
	DatabaseCustomError,
	DatabaseCustomErrorsTags,
} from '../../../../error';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { TypeOrmUniqueRegistryEntity } from '../../../entities/uniqueRegistry.entity';

@Injectable()
export class TypeOrmEmployeeMemberRemove
implements EmployeeMemberWriteOps.Remove
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: EmployeeMemberRepoWriteOpsInterfaces.remove,
	): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Remove employee');

		await this.dataSource.transaction(async (t) => {
			const user = await t.getRepository(TypeOrmUserEntity).findOne({
				where: { id: input.userId.value },
				loadRelationIds: true,
			});

			if (!user)
				throw new DatabaseCustomError({
					message: 'Usuário não existe',
					tag: DatabaseCustomErrorsTags.contentDoesntExists,
				});

			await t.delete(TypeOrmUniqueRegistryEntity, {
				id: user.uniqueRegistry,
			});
		});

		span.end();
	}
}
