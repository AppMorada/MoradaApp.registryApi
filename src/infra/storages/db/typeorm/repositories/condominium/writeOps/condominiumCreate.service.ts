import {
	CondominiumWriteOpsInterfaces,
	CondominiumWriteOps,
} from '@app/repositories/condominium/write';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCondominiumEntity } from '../../../entities/condominium.entity';
import { Repository } from 'typeorm';
import { TypeOrmCondominiumMapper } from '../../../mapper/condominium';
import { typeORMConsts } from '../../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { TypeOrmCondominiumMemberEntity } from '../../../entities/condominiumMember.entity';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { TypeOrmCondominiumMemberMapper } from '../../../mapper/condominiumMember';

@Injectable()
export class TypeOrmCondominiumCreate implements CondominiumWriteOps.Create {
	constructor(
		@Inject(typeORMConsts.entity.condominium)
		private readonly condominiumRepo: Repository<TypeOrmCondominiumEntity>,
		@Inject(typeORMConsts.entity.condominiumMember)
		private readonly condominiumMemberRepo: Repository<TypeOrmCondominiumMemberEntity>,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(input: CondominiumWriteOpsInterfaces.create): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create condominium');

		const condominiumMember = TypeOrmCondominiumMemberMapper.toTypeOrm(
			new CondominiumMember({
				role: 2,
				userId: input.user.id.value,
				condominiumId: input.condominium.id.value,
				uniqueRegistryId: input.user.uniqueRegistryId.value,
			}),
		);
		const condominium = TypeOrmCondominiumMapper.toTypeOrm(
			input.condominium,
		);

		await this.condominiumRepo.insert(condominium);
		await this.condominiumMemberRepo.insert(condominiumMember);

		span.end();
	}
}
