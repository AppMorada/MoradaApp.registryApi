import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmCondominiumRequestEntity } from '../../../entities/condominiumRequest.entity';
import { typeORMConsts } from '../../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { TypeOrmCondominiumRequestMapper } from '../../../mapper/condominiumRequest';
import {
	CondominiumRequestWriteOps,
	CondominiumRequestRepoWriteOpsInterfaces,
} from '@app/repositories/condominiumRequest/write';
import { TypeOrmCondominiumMemberMapper } from '../../../mapper/condominiumMember';
import { TypeOrmCondominiumMemberEntity } from '../../../entities/condominiumMember.entity';
import { CondominiumMember } from '@app/entities/condominiumMember';

@Injectable()
export class TypeOrmCondominiumRequestCreate
implements CondominiumRequestWriteOps.Create
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(input: CondominiumRequestRepoWriteOpsInterfaces.create) {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Create condominium request');

		await this.dataSource.transaction(async (t) => {
			const requesterCondominiumMember =
				TypeOrmCondominiumMemberMapper.toTypeOrm(
					new CondominiumMember({
						condominiumId: input.request.condominiumId.value,
						userId: input.request.userId.value,
						uniqueRegistryId: input.request.uniqueRegistryId.value,
						role: -1,
					}),
				);
			const condominiumRequest =
				TypeOrmCondominiumRequestMapper.toTypeOrm(input.request);

			await t
				.getRepository(TypeOrmCondominiumMemberEntity)
				.insert(requesterCondominiumMember);
			await t
				.getRepository(TypeOrmCondominiumRequestEntity)
				.insert(condominiumRequest);
		});

		span.end();
	}
}
