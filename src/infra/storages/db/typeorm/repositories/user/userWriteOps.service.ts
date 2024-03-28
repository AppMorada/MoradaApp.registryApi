import {
	UserRepoWriteOps,
	UserRepoWriteOpsInterfaces,
} from '@app/repositories/user/write';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmUserEntity } from '../../entities/user.entity';
import { typeORMConsts } from '../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { TypeOrmUserMapper } from '../../mapper/user';
import { TypeOrmUniqueRegistryEntity } from '../../entities/uniqueRegistry.entity';
import { TypeOrmUniqueRegistryMapper } from '../../mapper/uniqueRegistry';

@Injectable()
export class TypeOrmUserRepoWriteOps implements UserRepoWriteOps {
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async create(input: UserRepoWriteOpsInterfaces.create): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create user');

		const parsedUser = TypeOrmUserMapper.toTypeOrm(input.user);
		const parsedUniqueRegistry = TypeOrmUniqueRegistryMapper.toTypeOrm(
			input.uniqueRegistry,
		);

		await this.dataSource.transaction(async (t) => {
			const uniqueRegistry = await t
				.getRepository(TypeOrmUniqueRegistryEntity)
				.findOne({
					where: { id: input.uniqueRegistry.id.value },
					lock: {
						mode: 'pessimistic_read',
					},
				});
			if (!uniqueRegistry)
				await t.insert('unique_registries', parsedUniqueRegistry);
			await t.insert('users', parsedUser);
		});

		span.end();
	}

	async delete(input: UserRepoWriteOpsInterfaces.remove): Promise<void> {
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
				lock: {
					mode: 'pessimistic_read',
				},
			});
			if (!user) return;

			await t
				.createQueryBuilder()
				.delete()
				.from('unique_registries')
				.where('id = :id', { id: user.uniqueRegistry as string })
				.execute();
		});

		span.end();
	}

	async update(input: UserRepoWriteOpsInterfaces.update): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Update user');

		const modifications = {
			name: input.name?.value,
			phoneNumber: input.phoneNumber?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		await this.dataSource
			.createQueryBuilder()
			.update(TypeOrmUserEntity)
			.set(modifications)
			.where('id = :id', { id: input.id.value })
			.execute();

		span.end();
	}
}
