import {
	CondominiumRequestReadOps,
	CondominiumRequestRepoReadOpsInterfaces,
} from '@app/repositories/condominiumRequest/read';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { typeORMConsts } from '../../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { TypeOrmCondominiumRequestMapper } from '../../../mapper/condominiumRequest';
import { TypeOrmUserEntity } from '../../../entities/user.entity';
import { TypeOrmUniqueRegistryEntity } from '../../../entities/uniqueRegistry.entity';

@Injectable()
export class TypeOrmCondominiumRequestFindByUserId
implements CondominiumRequestReadOps.FindByUserId
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async exec(
		input: CondominiumRequestRepoReadOpsInterfaces.search,
	): Promise<
		CondominiumRequestRepoReadOpsInterfaces.findByUserIdResult | undefined
	> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute(
			'op.description',
			'Get condominium requests by user id',
		);

		const user = await this.dataSource
			.getRepository(TypeOrmUserEntity)
			.createQueryBuilder('user')
			.innerJoinAndSelect('user.condominiumRequest', 'a')
			.innerJoinAndSelect('user.uniqueRegistry', 'b')
			.where('user.id = :id', { id: input.id.value })
			.getOne();

		span.end();

		if (!user) return undefined;

		const uniqueRegistry =
			user.uniqueRegistry as TypeOrmUniqueRegistryEntity;
		const condominiumRequests = user.condominiumRequest.map((item) => {
			const request = TypeOrmCondominiumRequestMapper.toObject(item);
			request.uniqueRegistryId = uniqueRegistry.id;
			request.userId = user.id;
			return request;
		});

		return {
			name: user.name,
			email: uniqueRegistry.email,
			requests: condominiumRequests,
		};
	}
}
