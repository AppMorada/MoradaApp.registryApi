import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmCondominiumRequestEntity } from '../../../entities/condominiumRequest.entity';
import { typeORMConsts } from '../../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import {
	CondominiumRequestWriteOps,
	CondominiumRequestRepoWriteOpsInterfaces,
} from '@app/repositories/condominiumRequest/write';
import { TypeOrmCondominiumMemberEntity } from '../../../entities/condominiumMember.entity';

@Injectable()
export class TypeOrmCondominiumRequestRemove
implements CondominiumRequestWriteOps.RemoveByUserIdAndCondominiumId
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(input: CondominiumRequestRepoWriteOpsInterfaces.remove) {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute('op.description', 'Delete condominium request');

		await this.dataSource.transaction(async (t) => {
			await t.getRepository(TypeOrmCondominiumRequestEntity).delete({
				user: input.userId.value,
				condominium: input.condominiumId.value,
			});

			await t.getRepository(TypeOrmCondominiumMemberEntity).delete({
				user: input.userId.value,
				condominium: input.condominiumId.value,
			});
		});

		span.end();
	}
}
