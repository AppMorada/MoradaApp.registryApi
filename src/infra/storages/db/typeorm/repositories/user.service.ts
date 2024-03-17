import { UserRepo, UserRepoInterfaces } from '@app/repositories/user';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';
import { TypeOrmUserMapper } from '../mapper/user';
import { typeORMConsts } from '../consts';
import { TypeOrmUniqueRegistryMapper } from '../mapper/uniqueRegistry';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { UUID } from '@app/entities/VO';

@Injectable()
export class TypeOrmUserRepo implements UserRepo {
	constructor(
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
	) {}

	async find(
		input: UserRepoInterfaces.safeSearch,
	): Promise<UserRepoInterfaces.searchReturnableData>;
	async find(
		input: UserRepoInterfaces.search,
	): Promise<UserRepoInterfaces.searchReturnableData | undefined>;

	async find(
		input: UserRepoInterfaces.search | UserRepoInterfaces.safeSearch,
	): Promise<UserRepoInterfaces.searchReturnableData | undefined> {
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

	async delete(input: UserRepoInterfaces.remove): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			const user = await t.getRepository(TypeOrmUserEntity).findOne({
				where: {
					id: input.key.value,
				},
				loadRelationIds: true,
			});
			if (!user) return;

			await t
				.createQueryBuilder()
				.delete()
				.from('unique_registries')
				.where('id = :id', { id: user.uniqueRegistry as string })
				.execute();
		});
	}

	async update(input: UserRepoInterfaces.update): Promise<void> {
		const modifications = {
			name: input.name?.value,
			phoneNumber: input.phoneNumber?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		await this.dataSource
			.createQueryBuilder()
			.update(TypeOrmUserEntity)
			.set(modifications)
			.where('id = :id', { id: input.id.value })
			.execute();
	}
}
