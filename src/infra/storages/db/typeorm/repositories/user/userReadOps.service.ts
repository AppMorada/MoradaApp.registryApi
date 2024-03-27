import {
	UserRepoReadOps,
	UserRepoReadOpsInterfaces,
} from '@app/repositories/user/read';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmUserEntity } from '../../entities/user.entity';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../../error';
import { TypeOrmUserMapper } from '../../mapper/user';
import { typeORMConsts } from '../../consts';
import { TypeOrmUniqueRegistryMapper } from '../../mapper/uniqueRegistry';
import { TypeOrmUniqueRegistryEntity } from '../../entities/uniqueRegistry.entity';
import { UUID } from '@app/entities/VO';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmUserRepoReadOps implements UserRepoReadOps {
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	async find(
		input: UserRepoReadOpsInterfaces.safeSearch,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData>;
	async find(
		input: UserRepoReadOpsInterfaces.search,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData | undefined>;

	async find(
		input:
			| UserRepoReadOpsInterfaces.search
			| UserRepoReadOpsInterfaces.safeSearch,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData | undefined> {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute('op.description', 'Find user');

		let rawUser: TypeOrmUserEntity | null = null;
		input.key instanceof UUID
			? (rawUser = await this.dataSource
				.getRepository(TypeOrmUserEntity)
				.createQueryBuilder('user')
				.innerJoinAndSelect('user.uniqueRegistry', 'a')
				.where('user.id = :id', { id: input.key.value })
				.getOne())
			: (rawUser = await this.dataSource
				.getRepository(TypeOrmUserEntity)
				.createQueryBuilder('user')
				.innerJoinAndSelect('user.uniqueRegistry', 'a')
				.where('a.email = :email', { email: input.key.value })
				.getOne());
		span.end();

		if (!rawUser && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este usuário não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		if (!rawUser) return undefined;

		const uniqueRegistry = TypeOrmUniqueRegistryMapper.toClass(
			rawUser.uniqueRegistry as TypeOrmUniqueRegistryEntity,
		);
		rawUser.uniqueRegistry = uniqueRegistry.id.value;

		const user = TypeOrmUserMapper.toClass(rawUser);
		return { user, uniqueRegistry };
	}
}
