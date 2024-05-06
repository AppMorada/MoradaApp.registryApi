import {
	UserReadOps,
	UserRepoReadOpsInterfaces,
} from '@app/repositories/user/read';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmUserEntity } from '../../../entities/user.entity';
import {
	DatabaseCustomError,
	DatabaseCustomErrorsTags,
} from '../../../../error';
import { TypeOrmUserMapper } from '../../../mapper/user';
import { typeORMConsts } from '../../../consts';
import { TypeOrmUniqueRegistryMapper } from '../../../mapper/uniqueRegistry';
import { TypeOrmUniqueRegistryEntity } from '../../../entities/uniqueRegistry.entity';
import { Email, UUID } from '@app/entities/VO';
import { TRACE_ID, TraceHandler } from '@infra/configs/tracing';

@Injectable()
export class TypeOrmUserRead implements UserReadOps.Read {
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
		@Inject(TRACE_ID)
		private readonly trace: TraceHandler,
	) {}

	private async searchBasedOnKeyType(key: UUID | Email) {
		if (key instanceof UUID)
			return await this.dataSource
				.getRepository(TypeOrmUserEntity)
				.createQueryBuilder('user')
				.innerJoinAndSelect('user.uniqueRegistry', 'a')
				.where('user.id = :id', { id: key.value })
				.getOne();

		return await this.dataSource
			.getRepository(TypeOrmUserEntity)
			.createQueryBuilder('user')
			.innerJoinAndSelect('user.uniqueRegistry', 'a')
			.where('a.email = :email', { email: key.value })
			.getOne();
	}

	private async execUserSearchWithSpans(key: UUID | Email) {
		const tracer = this.trace.getTracer(typeORMConsts.trace.name);
		const span = tracer.startSpan(typeORMConsts.trace.op);
		span.setAttribute('op.mode', 'read');
		span.setAttribute('op.description', 'Find user');

		const rawUser = await this.searchBasedOnKeyType(key);

		span.end();

		return rawUser;
	}

	async exec(
		input: UserRepoReadOpsInterfaces.safeSearch,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData>;
	async exec(
		input: UserRepoReadOpsInterfaces.search,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData | undefined>;

	async exec(
		input:
			| UserRepoReadOpsInterfaces.search
			| UserRepoReadOpsInterfaces.safeSearch,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData | undefined> {
		const rawUser = await this.execUserSearchWithSpans(input.key);

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
