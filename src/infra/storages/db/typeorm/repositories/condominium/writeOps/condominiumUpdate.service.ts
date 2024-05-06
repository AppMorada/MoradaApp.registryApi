import {
	CondominiumWriteOpsInterfaces,
	CondominiumWriteOps,
} from '@app/repositories/condominium/write';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCondominiumEntity } from '../../../entities/condominium.entity';
import { Repository } from 'typeorm';
import { typeORMConsts } from '../../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { CEP } from '@app/entities/VO';

@Injectable()
export class TypeOrmCondominiumUpdate implements CondominiumWriteOps.Update {
	constructor(
		@Inject(typeORMConsts.entity.condominium)
		private readonly condominiumRepo: Repository<TypeOrmCondominiumEntity>,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(input: CondominiumWriteOpsInterfaces.update): Promise<void> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Update condominium');

		const modifications = {
			name: input.name?.value,
			CEP: input.CEP ? CEP.toInt(input.CEP) : undefined,
			num: input.num?.value,
			district: input.district?.value,
			city: input.city?.value,
			state: input.state?.value,
			reference: input.reference?.value,
			complement: input.complement?.value,
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
