import {
	CondominiumReadOps,
	CondominiumReadOpsInterfaces,
} from '@app/repositories/condominium/read';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCondominiumEntity } from '../../../entities/condominium.entity';
import { Repository } from 'typeorm';
import { TypeOrmCondominiumMapper } from '../../../mapper/condominium';
import { typeORMConsts } from '../../../consts';
import { TCondominiumInObject } from '@app/mapper/condominium';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmCondominiumGetByOwnerId
implements CondominiumReadOps.GetByOwnerId
{
	constructor(
		@Inject(typeORMConsts.entity.condominium)
		private readonly condominiumRepo: Repository<TypeOrmCondominiumEntity>,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: CondominiumReadOpsInterfaces.getCondominiumsByOwnerId,
	): Promise<TCondominiumInObject[]> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute(
			'op.description',
			'Get condominium based on owner id',
		);

		const rawData = await this.condominiumRepo.find({
			where: {
				user: {
					id: input.id.value,
				},
			},
			loadRelationIds: true,
		});

		span.end();

		return rawData.map((item) => TypeOrmCondominiumMapper.toObject(item));
	}
}
