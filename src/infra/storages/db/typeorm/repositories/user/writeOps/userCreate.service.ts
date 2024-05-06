import {
	UserRepoWriteOpsInterfaces,
	UserWriteOps,
} from '@app/repositories/user/write';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { typeORMConsts } from '../../../consts';
import { TypeOrmUniqueRegistryEntity } from '../../../entities/uniqueRegistry.entity';
import { TypeOrmUserEntity } from '../../../entities/user.entity';
import { TypeOrmCondominiumMemberEntity } from '../../../entities/condominiumMember.entity';
import { TypeOrmUserMapper } from '../../../mapper/user';
import { TypeOrmUniqueRegistryMapper } from '../../../mapper/uniqueRegistry';

@Injectable()
export class TypeOrmUserCreate implements UserWriteOps.Create {
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	private async createUser(
		input: UserRepoWriteOpsInterfaces.create,
		parsedUniqueRegistry: TypeOrmUniqueRegistryEntity,
		parsedUser: TypeOrmUserEntity,
		affectCondominiumMembersRef: { quantity: number },
	) {
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

			affectCondominiumMembersRef.quantity = result.affected ?? 0;
		});
	}

	async exec(
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

		const affectedCondominiumMembers = { quantity: 0 };

		await this.createUser(
			input,
			parsedUniqueRegistry,
			parsedUser,
			affectedCondominiumMembers,
		);

		span.end();

		return {
			affectedCondominiumMembers:
				affectedCondominiumMembers.quantity || undefined,
		};
	}
}
