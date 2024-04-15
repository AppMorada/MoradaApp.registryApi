import {
	UserRepoWriteOps,
	UserRepoWriteOpsInterfaces,
} from '@app/repositories/user/write';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmUserEntity } from '../../entities/user.entity';
import { typeORMConsts } from '../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { TypeOrmUserMapper } from '../../mapper/user';
import { TypeOrmUniqueRegistryEntity } from '../../entities/uniqueRegistry.entity';
import { TypeOrmUniqueRegistryMapper } from '../../mapper/uniqueRegistry';
import { TypeOrmCondominiumMemberEntity } from '../../entities/condominiumMember.entity';

@Injectable()
export class TypeOrmUserRepoWriteOps implements UserRepoWriteOps {
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(typeORMConsts.entity.user)
		private readonly userRepo: Repository<TypeOrmUserEntity>,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async create(
		input: UserRepoWriteOpsInterfaces.create,
	): Promise<UserRepoWriteOpsInterfaces.createReturn> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create user');

		const parsedUser = TypeOrmUserMapper.toTypeOrm(input.user);
		const parsedUniqueRegistry = TypeOrmUniqueRegistryMapper.toTypeOrm(
			input.uniqueRegistry,
		);

		let affectedCondominiumMembers: undefined | number;

		await this.dataSource.transaction(async (t) => {
			const uniqueRegistry = await t
				.getRepository(TypeOrmUniqueRegistryEntity)
				.findOne({
					where: {
						email: input.uniqueRegistry.email.value,
						CPF: input.uniqueRegistry.CPF?.value,
					},
				});
			if (!uniqueRegistry)
				await t.insert('unique_registries', parsedUniqueRegistry);

			const uniqueRegistryId =
				uniqueRegistry?.id ?? parsedUniqueRegistry.id;
			parsedUser.uniqueRegistry = uniqueRegistryId;
			await t.insert('users', parsedUser);
			const result = await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.update(
					{
						uniqueRegistry: {
							id: uniqueRegistryId,
						},
					},
					{ user: parsedUser.id },
				);

			affectedCondominiumMembers = result.affected;
		});

		span.end();

		return { affectedCondominiumMembers };
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
			});
			if (!user) return;

			await t.delete(TypeOrmUniqueRegistryEntity, {
				id: user.uniqueRegistry as string,
			});
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
			password: input.password?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		await this.userRepo.update({ id: input.id.value }, modifications);
		span.end();
	}
}
