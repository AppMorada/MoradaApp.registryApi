import {
	UserRepoWriteOpsInterfaces,
	UserWriteOps,
} from '@app/repositories/user/write';
import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { DataSource } from 'typeorm';
import { TypeOrmUserEntity } from '../../../entities/user.entity';
import { TypeOrmUniqueRegistryEntity } from '../../../entities/uniqueRegistry.entity';

@Injectable()
export class TypeOrmUserDelete implements UserWriteOps.Delete {
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(input: UserRepoWriteOpsInterfaces.remove): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Delete user');

		await this.dataSource.transaction(async (t) => {
			const user = await t.getRepository(TypeOrmUserEntity).findOne({
				where: {
					id: input.key.value,
				},
				loadRelationIds: true,
			});
			if (!user) return;

			await t.delete(TypeOrmUniqueRegistryEntity, {
				id: user.uniqueRegistry as string,
			});
		});

		span.end();
	}
}
