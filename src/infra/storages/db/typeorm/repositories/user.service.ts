import { User } from '@app/entities/user';
import { UserRepo, UserRepoInterfaces } from '@app/repositories/user';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmUserEntity } from '../entities/user.entity';
import { Email, UUID } from '@app/entities/VO';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';
import { CondominiumRelUser } from '@app/entities/condominiumRelUser';
import { TypeOrmCondominiumRelUserEntity } from '../entities/condominiumRelUser.entity';
import { TCondominiumRelUserToObject } from '@app/mapper/condominiumRelUser';
import { TypeOrmCondominiumRelUserMapper } from '../mapper/condominiumRelUser';
import { TypeOrmUserMapper } from '../mapper/user';
import { typeORMConsts } from '../consts';

type TQuery = { id: string } | { email: string } | { CPF: string };

@Injectable()
export class TypeOrmUserRepo implements UserRepo {
	constructor(
		@Inject(typeORMConsts.entity.user)
		private readonly userRepo: Repository<TypeOrmUserEntity>,
		@Inject(typeORMConsts.entity.condominiumRelUser)
		private readonly condominiumRelUserRepo: Repository<TypeOrmCondominiumRelUserEntity>,
	) {}

	async create(): Promise<void> {
		throw new Error('Method not implemented');
	}

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

	async getCondominiumRelation(
		input: UserRepoInterfaces.getCondominiumRelation,
	): Promise<CondominiumRelUser | undefined> {
		const rawData = await this.condominiumRelUserRepo
			.createQueryBuilder()
			.where(
				'TypeOrmCondominiumRelUserEntity.condominium_id = :condominium_id',
				{ condominium_id: input.condominiumId.value },
			)
			.andWhere('TypeOrmCondominiumRelUserEntity.user_id = :user_id', {
				user_id: input.userId.value,
			})
			.loadAllRelationIds()
			.getOne();

		if (!rawData) return undefined;
		const parsedData = TypeOrmCondominiumRelUserMapper.toClass(rawData);
		return parsedData;
	}

	async getAllCondominiumRelation(
		input: UserRepoInterfaces.getAllCondominiumRelation,
	): Promise<TCondominiumRelUserToObject[]> {
		const rawData = await this.condominiumRelUserRepo
			.createQueryBuilder()
			.where('TypeOrmCondominiumRelUserEntity.user_id = :user_id', {
				user_id: input.userId.value,
			})
			.loadAllRelationIds()
			.getMany();

		const parsedData = rawData.map((item) => {
			return TypeOrmCondominiumRelUserMapper.toObject(item);
		});
		return parsedData;
	}

	async delete(input: UserRepoInterfaces.remove): Promise<void> {
		const query =
			input.key instanceof UUID
				? { id: input.key.value }
				: { email: input.key.value };

		await this.userRepo.delete(query);
	}
}
