import { Condominium } from '@app/entities/condominium';
import {
	CondominiumInterfaces,
	CondominiumRepo,
} from '@app/repositories/condominium';
import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmCondominiumEntity } from '../entities/condominium.entity';
import { Repository } from 'typeorm';
import { CNPJ, Name, UUID } from '@app/entities/VO';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';
import { TypeOrmCondominiumMapper } from '../mapper/condominium';
import { typeORMConsts } from '../consts';

type TQuery =
	| { id: string }
	| { CNPJ: string }
	| { CEP: string }
	| { name: string };

@Injectable()
export class TypeOrmCondominiumRepo implements CondominiumRepo {
	constructor(
		@Inject(typeORMConsts.entity.condominium)
		private readonly condominiumRepo: Repository<TypeOrmCondominiumEntity>,
	) {}

	async create(input: CondominiumInterfaces.create): Promise<void> {
		const parsedData = TypeOrmCondominiumMapper.toTypeOrm(
			input.condominium,
		);
		await this.condominiumRepo.insert({ ...parsedData });
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

			return { CEP: input.key.value };
		};

		const rawData = await this.condominiumRepo.findOne({
			where: queryBuilder(),
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
}
