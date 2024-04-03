import {
	CondominiumWriteOpsInterfaces,
	CondominiumRepoWriteOps,
} from '@app/repositories/condominium/write';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCondominiumEntity } from '../../entities/condominium.entity';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmCondominiumMapper } from '../../mapper/condominium';
import { typeORMConsts } from '../../consts';
import { TypeOrmUniqueRegistryMapper } from '../../mapper/uniqueRegistry';
import { TypeOrmUserMapper } from '../../mapper/user';
import { TypeOrmUniqueRegistryEntity } from '../../entities/uniqueRegistry.entity';
import { TypeOrmUserEntity } from '../../entities/user.entity';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { CEP } from '@app/entities/VO';
import { TypeOrmCondominiumMemberEntity } from '../../entities/condominiumMember.entity';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { TypeOrmCondominiumMemberMapper } from '../../mapper/condominiumMember';

@Injectable()
export class TypeOrmCondominiumRepoWriteOps implements CondominiumRepoWriteOps {
	constructor(
		@Inject(typeORMConsts.entity.condominium)
		private readonly condominiumRepo: Repository<TypeOrmCondominiumEntity>,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async create(input: CondominiumWriteOpsInterfaces.create): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create condominium');

		await this.dataSource.transaction(async (t) => {
			const uniqueRegistry = TypeOrmUniqueRegistryMapper.toTypeOrm(
				input.uniqueRegistry,
			);
			const user = TypeOrmUserMapper.toTypeOrm(input.user);
			const condominium = TypeOrmCondominiumMapper.toTypeOrm(
				input.condominium,
			);
			const condominiumMember = new CondominiumMember({
				role: 2,
				userId: user.id,
				condominiumId: condominium.id,
				uniqueRegistryId: uniqueRegistry.id,
			});

			await t.insert(TypeOrmUniqueRegistryEntity, uniqueRegistry);
			await t.insert(TypeOrmUserEntity, user);
			await t.insert(TypeOrmCondominiumEntity, condominium);
			await t.insert(
				TypeOrmCondominiumMemberEntity,
				TypeOrmCondominiumMemberMapper.toTypeOrm(condominiumMember),
			);
		});
		span.end();
	}

	async remove(input: CondominiumWriteOpsInterfaces.remove): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Delete condominium');

		await this.condominiumRepo.delete({ id: input.id.value });

		span.end();
	}

	async update(input: CondominiumWriteOpsInterfaces.update): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Update condominium');

		const modifications = {
			name: input.name?.value,
			CEP: input.CEP ? CEP.toInt(input.CEP) : undefined,
			num: input.num?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		await this.condominiumRepo.update(
			{ id: input.id.value },
			modifications,
		);

		span.end();
	}
}
