import { Condominium } from '@app/entities/condominium';
import {
	CondominiumReadOps,
	CondominiumReadOpsInterfaces,
} from '@app/repositories/condominium/read';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCondominiumEntity } from '../../../entities/condominium.entity';
import { Repository } from 'typeorm';
import { CEP, CNPJ, Name, UUID } from '@app/entities/VO';
import {
	DatabaseCustomError,
	DatabaseCustomErrorsTags,
} from '../../../../error';
import { TypeOrmCondominiumMapper } from '../../../mapper/condominium';
import { typeORMConsts } from '../../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

type TQuery =
	| { id: string }
	| { CNPJ: string }
	| { CEP: number }
	| { name: string };

@Injectable()
export class TypeOrmCondominiumSearch implements CondominiumReadOps.Search {
	constructor(
		@Inject(typeORMConsts.entity.condominium)
		private readonly condominiumRepo: Repository<TypeOrmCondominiumEntity>,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: CondominiumReadOpsInterfaces.search,
	): Promise<Condominium | undefined>;
	async exec(
		input: CondominiumReadOpsInterfaces.safeSearch,
	): Promise<Condominium>;

	async exec(
		input:
			| CondominiumReadOpsInterfaces.search
			| CondominiumReadOpsInterfaces.safeSearch,
	): Promise<Condominium | undefined> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute('op.description', 'Find condominium');

		const queryBuilder = (): TQuery => {
			if (input.key instanceof UUID) return { id: input.key.value };
			if (input.key instanceof Name) return { name: input.key.value };
			if (input.key instanceof CNPJ) return { CNPJ: input.key.value };

			return { CEP: CEP.toInt(input.key) };
		};

		const raw = await this.condominiumRepo.findOne({
			where: queryBuilder(),
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
