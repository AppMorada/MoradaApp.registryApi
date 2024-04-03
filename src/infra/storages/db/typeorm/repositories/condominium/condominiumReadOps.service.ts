import { Condominium } from '@app/entities/condominium';
import {
	CondominiumReadOpsInterfaces,
	CondominiumRepoReadOps,
} from '@app/repositories/condominium/read';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCondominiumEntity } from '../../entities/condominium.entity';
import { Repository } from 'typeorm';
import { CEP, CNPJ, Name, UUID } from '@app/entities/VO';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../../error';
import { TypeOrmCondominiumMapper } from '../../mapper/condominium';
import { typeORMConsts } from '../../consts';
import { TCondominiumInObject } from '@app/mapper/condominium';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

type TQuery =
	| { id: string }
	| { CNPJ: string }
	| { CEP: number }
	| { name: string };

@Injectable()
export class TypeOrmCondominiumRepoReadOps implements CondominiumRepoReadOps {
	constructor(
		@Inject(typeORMConsts.entity.condominium)
		private readonly condominiumRepo: Repository<TypeOrmCondominiumEntity>,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async getCondominiumsByOwnerId(
		input: CondominiumReadOpsInterfaces.getCondominiumsByOwnerId,
	): Promise<Required<TCondominiumInObject>[]> {
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
		});

		span.end();

		return rawData.map((item) => TypeOrmCondominiumMapper.toObject(item));
	}

	async find(
		input: CondominiumReadOpsInterfaces.search,
	): Promise<Condominium | undefined>;
	async find(
		input: CondominiumReadOpsInterfaces.safeSearch,
	): Promise<Condominium>;

	async find(
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

	async getByHumanReadableId(
		input: CondominiumReadOpsInterfaces.getByHumanReadableId,
	): Promise<Condominium | undefined>;
	async getByHumanReadableId(
		input: CondominiumReadOpsInterfaces.getByHumanReadableIdAsSafeSearch,
	): Promise<Condominium>;

	async getByHumanReadableId(
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
