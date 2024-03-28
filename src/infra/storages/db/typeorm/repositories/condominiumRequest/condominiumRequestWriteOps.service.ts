import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmCondominiumRequestEntity } from '../../entities/condominiumRequest.entity';
import { typeORMConsts } from '../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { TypeOrmCondominiumRequestMapper } from '../../mapper/condominiumRequest';
import {
	CondominiumRequestRepoWriteOps,
	CondominiumRequestRepoWriteOpsInterfaces,
} from '@app/repositories/condominiumRequest/write';

@Injectable()
export class TypeOrmCondominiumRequestWriteOps
implements CondominiumRequestRepoWriteOps
{
	constructor(
		@Inject(typeORMConsts.entity.request)
		private readonly requestRepo: Repository<TypeOrmCondominiumRequestEntity>,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async create(input: CondominiumRequestRepoWriteOpsInterfaces.create) {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create condominium request');

		const parsedData = TypeOrmCondominiumRequestMapper.toTypeOrm(
			input.request,
		);
		await this.requestRepo.insert(parsedData);

		span.end();
	}

	async removeByUserId(
		input: CondominiumRequestRepoWriteOpsInterfaces.remove,
	) {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Delete condominium request');

		await this.dataSource
			.getRepository(TypeOrmCondominiumRequestEntity)
			.createQueryBuilder()
			.delete()
			.from('requests')
			.where('user_id = :id', { id: input.id.value })
			.execute();

		span.end();
	}
}
