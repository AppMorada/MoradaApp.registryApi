import {
	CondominiumRequestRepoReadOps,
	CondominiumRequestRepoReadOpsInterfaces,
} from '@app/repositories/condominiumRequest/read';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmCondominiumRequestEntity } from '../../entities/condominiumRequest.entity';
import { typeORMConsts } from '../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { TypeOrmCondominiumRequestMapper } from '../../mapper/condominiumRequest';

@Injectable()
export class TypeOrmCondominiumRequestReadOps
implements CondominiumRequestRepoReadOps
{
	constructor(
		@Inject(typeORMConsts.entity.request)
		private readonly requestRepo: Repository<TypeOrmCondominiumRequestEntity>,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async findByUserId(input: CondominiumRequestRepoReadOpsInterfaces.search) {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute(
			'op.description',
			'Get condominium requests by user id',
		);

		const raw = await this.requestRepo.findOne({
			where: { user: input.id.value },
		});

		span.end();
		return raw ? TypeOrmCondominiumRequestMapper.toClass(raw) : undefined;
	}

	async findByCondominiumId(
		input: CondominiumRequestRepoReadOpsInterfaces.search,
	) {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute(
			'op.description',
			'Get condominium requests by user id',
		);

		const raw = await this.requestRepo.findBy({
			condominium: input.id.value,
		});

		span.end();
		return raw.map((item) =>
			TypeOrmCondominiumRequestMapper.toObject(item),
		);
	}
}
