import { Condominium } from '@app/entities/condominium';
import {
	CondominiumReadOps,
	CondominiumReadOpsInterfaces,
} from '@app/repositories/condominium/read';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCondominiumEntity } from '../../../entities/condominium.entity';
import { Repository } from 'typeorm';
import {
	DatabaseCustomError,
	DatabaseCustomErrorsTags,
} from '../../../../error';
import { TypeOrmCondominiumMapper } from '../../../mapper/condominium';
import { typeORMConsts } from '../../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmCondominiumGetByHumanReadableId
implements CondominiumReadOps.GetByHumanReadableId
{
	constructor(
		@Inject(typeORMConsts.entity.condominium)
		private readonly condominiumRepo: Repository<TypeOrmCondominiumEntity>,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: CondominiumReadOpsInterfaces.getByHumanReadableId,
	): Promise<Condominium | undefined>;
	async exec(
		input: CondominiumReadOpsInterfaces.getByHumanReadableIdAsSafeSearch,
	): Promise<Condominium>;

	async exec(
		input:
			| CondominiumReadOpsInterfaces.getByHumanReadableId
			| CondominiumReadOpsInterfaces.getByHumanReadableIdAsSafeSearch,
	): Promise<Condominium | undefined> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute(
			'op.description',
			'Get condominium based human readable id',
		);

		const raw = await this.condominiumRepo.findOne({
			where: {
				humanReadableId: input.id,
			},
			loadRelationIds: true,
		});

		span.end();

		if (!raw && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este condomínio não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		return raw ? TypeOrmCondominiumMapper.toClass(raw) : undefined;
	}
}
