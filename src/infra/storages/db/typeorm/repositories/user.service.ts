import { User } from '@app/entities/user';
import { UserRepo, UserRepoInterfaces } from '@app/repositories/user';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { Email, UUID } from '@app/entities/VO';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';
import { TypeOrmUserMapper } from '../mapper/user';
import { typeORMConsts } from '../consts';

type TQuery = { id: string } | { email: string } | { CPF: string };

@Injectable()
export class TypeOrmUserRepo implements UserRepo {
	constructor(
		@Inject(typeORMConsts.entity.user)
		private readonly userRepo: Repository<TypeOrmUserEntity>,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
	) {}

	async find(input: UserRepoInterfaces.safeSearch): Promise<User>;
	async find(input: UserRepoInterfaces.search): Promise<User | undefined>;

	async find(
		input: UserRepoInterfaces.search | UserRepoInterfaces.safeSearch,
	): Promise<User | undefined> {
		const buildQuery = (): TQuery => {
			if (input.key instanceof UUID) return { id: input.key.value };

			if (input.key instanceof Email) return { email: input.key.value };

			return { CPF: input.key.value };
		};

		const rawUser = await this.userRepo.findOne({
			where: buildQuery(),
			loadRelationIds: true,
		});

		if (!rawUser && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este usuário não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		if (!rawUser) return undefined;

		const user = TypeOrmUserMapper.toClass(rawUser);
		return user;
	}

	async delete(input: UserRepoInterfaces.remove): Promise<void> {
		await this.userRepo.delete({ id: input.key.value });
	}

	async update(input: UserRepoInterfaces.update): Promise<void> {
		const modifications = {
			CPF: input.CPF?.value,
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
