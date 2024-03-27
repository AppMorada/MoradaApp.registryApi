import { Inject, Injectable } from '@nestjs/common';
import { typeORMConsts } from '../../consts';
import { DataSource } from 'typeorm';
import {
	EmployeeMemberRepoWriteOps,
	EmployeeMemberRepoWriteOpsInterfaces,
} from '@app/repositories/employeeMember/write';
import { TypeOrmUserMapper } from '../../mapper/user';
import { TypeOrmUserEntity } from '../../entities/user.entity';
import { TypeOrmCondominiumMemberMapper } from '../../mapper/condominiumMember';
import { TypeOrmUniqueRegistryMapper } from '../../mapper/uniqueRegistry';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../../error';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmEmployeeMemberRepoWriteOps
implements EmployeeMemberRepoWriteOps
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async create(
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

	async update(
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

	async remove(
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

			await t
				.createQueryBuilder()
				.delete()
				.from('unique_registries')
				.where('id = :id', { id: user.uniqueRegistry })
				.execute();
		});

		span.end();
	}
}
