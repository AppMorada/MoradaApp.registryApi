import {
	CondominiumRequestRepoReadOps,
	CondominiumRequestRepoReadOpsInterfaces,
} from '@app/repositories/condominiumRequest/read';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmCondominiumRequestEntity } from '../../entities/condominiumRequest.entity';
import { typeORMConsts } from '../../consts';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';
import { TypeOrmCondominiumRequestMapper } from '../../mapper/condominiumRequest';
import { TypeOrmUserEntity } from '../../entities/user.entity';
import { TypeOrmUniqueRegistryEntity } from '../../entities/uniqueRegistry.entity';

@Injectable()
export class TypeOrmCondominiumRequestReadOps
implements CondominiumRequestRepoReadOps
{
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async findByUserId(
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

	async findByCondominiumId(
		input: CondominiumRequestRepoReadOpsInterfaces.search,
	): Promise<
		CondominiumRequestRepoReadOpsInterfaces.findByCondominiumIdResult[]
	> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'write');
		span.setAttribute(
			'op.description',
			'Get condominium requests by user id',
		);

		const raw = await this.dataSource
			.getRepository(TypeOrmCondominiumRequestEntity)
			.createQueryBuilder('condominium_request')
			.innerJoinAndSelect('condominium_request.user', 'a')
			.innerJoinAndSelect('condominium_request.uniqueRegistry', 'b')
			.where('condominium_request.condominium_id = :id', {
				id: input.id.value,
			})
			.getMany();

		span.end();
		return raw.map((item) => {
			const user = item.user as TypeOrmUserEntity;
			const uniqueRegistry =
				item.uniqueRegistry as TypeOrmUniqueRegistryEntity;
			const condominiumRequest =
				TypeOrmCondominiumRequestMapper.toObject(item);

			condominiumRequest.userId = user.id;
			condominiumRequest.uniqueRegistryId = uniqueRegistry.id;

			return {
				request: condominiumRequest,
				email: uniqueRegistry.email,
				name: user.name,
			};
		});
	}
}
