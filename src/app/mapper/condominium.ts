import { Condominium } from '@app/entities/condominium';

export interface IConvertToObject {
	id?: string;
	ownerId: string;
	name: string;
	CEP: string;
	num: number;
	CNPJ: string;
	seedKey: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export type TCondominiumInObject = Required<IConvertToObject>;

export class CondominiumMapper {
	/**
	 * Método usado para converter um objeto de um condomínio em classe
	 * @param input - Deve conter os dados do condomínio em forma de objeto
	 **/
	static toClass(input: IConvertToObject): Condominium {
		return new Condominium(
			{
				name: input.name,
				CNPJ: input.CNPJ,
				CEP: input.CEP,
				num: input.num,
				ownerId: input.ownerId,
				seedKey: input.seedKey,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}

	/**
	 * Método usado para converter uma classe de condomínio em objeto
	 * @param input - Deve conter os dados do condomínio em forma de classe
	 **/
	static toObject(input: Condominium): TCondominiumInObject {
		return {
			id: input.id.value,
			ownerId: input.ownerId.value,
			num: input.num.value,
			CEP: input.CEP.value,
			name: input.name.value,
			CNPJ: input.CNPJ.value,
			seedKey: input.seedKey,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}
}
