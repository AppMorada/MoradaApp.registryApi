import { Condominium } from '@app/entities/condominium';
import {
	CondominiumInterfaces,
	CondominiumRepo,
} from '@app/repositories/condominium';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { DataSource, Repository } from 'typeorm';
import { CEP, CNPJ, Name, UUID } from '@app/entities/VO';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';
import { TypeOrmCondominiumMapper } from '../mapper/condominium';
import { typeORMConsts } from '../consts';
import { TCondominiumInObject } from '@app/mapper/condominium';
import { TypeOrmUniqueRegistryMapper } from '../mapper/uniqueRegistry';
import { TypeOrmUserMapper } from '../mapper/user';
import { TypeOrmUniqueRegistryEntity } from '../entities/uniqueRegistry.entity';
import { TypeOrmUserEntity } from '../entities/user.entity';

type TQuery =
	| { id: string }
	| { CNPJ: string }
	| { CEP: number }
	| { name: string };

@Injectable()
export class TypeOrmCondominiumRepo implements CondominiumRepo {
	constructor(
		@Inject(typeORMConsts.entity.condominium)
		private readonly condominiumRepo: Repository<TypeOrmCondominiumEntity>,
		@Inject(typeORMConsts.databaseProviders)
		private readonly dataSource: DataSource,
	) {}

	async create(input: CondominiumInterfaces.create): Promise<void> {
		await this.dataSource.transaction(async (t) => {
			const uniqueRegistry = TypeOrmUniqueRegistryMapper.toTypeOrm(
				input.uniqueRegistry,
			);
			const user = TypeOrmUserMapper.toTypeOrm(input.user);
			const condominium = TypeOrmCondominiumMapper.toTypeOrm(
				input.condominium,
			);

			await t.insert(TypeOrmUniqueRegistryEntity, uniqueRegistry);
			await t.insert(TypeOrmUserEntity, user);
			await t.insert(TypeOrmCondominiumEntity, condominium);
		});
	}

	async getCondominiumsByOwnerId(
		input: CondominiumInterfaces.getCondominiumsByOwnerId,
	): Promise<Required<TCondominiumInObject>[]> {
		const rawData = await this.dataSource
			.getRepository(TypeOrmCondominiumEntity)
			.createQueryBuilder('condominium')
			.where('owner_id = :owner_id', {
				owner_id: input.id.value,
			})
			.getMany();

		return rawData.map((item) => TypeOrmCondominiumMapper.toObject(item));
	}

	async find(
		input: CondominiumInterfaces.search,
	): Promise<Condominium | undefined>;
	async find(input: CondominiumInterfaces.safeSearch): Promise<Condominium>;

	async find(
		input: CondominiumInterfaces.search | CondominiumInterfaces.safeSearch,
	): Promise<Condominium | undefined> {
		const queryBuilder = (): TQuery => {
			if (input.key instanceof UUID) return { id: input.key.value };
			if (input.key instanceof Name) return { name: input.key.value };
			if (input.key instanceof CNPJ) return { CNPJ: input.key.value };

			return { CEP: CEP.toInt(input.key) };
		};

		const rawData = await this.condominiumRepo.findOne({
			where: queryBuilder(),
			loadRelationIds: true,
		});

		if (!rawData && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este condomínio não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		if (!rawData) return undefined;

		const condominium = TypeOrmCondominiumMapper.toClass(rawData);
		return condominium;
	}

	async remove(input: CondominiumInterfaces.remove): Promise<void> {
		await this.condominiumRepo.delete({ id: input.id.value });
	}

	async update(input: CondominiumInterfaces.update): Promise<void> {
		const modifications = {
			name: input.name?.value,
			CEP: input.CEP?.value,
			num: input.num?.value,
		};

		for (const rawKey in modifications) {
			const key = rawKey as keyof typeof modifications;
			if (!modifications[key]) delete modifications[key];
		}

		await this.dataSource
			.createQueryBuilder()
			.update('condominiums')
			.set(modifications)
			.where('id = :id', { id: input.id.value })
			.execute();
	}
}
