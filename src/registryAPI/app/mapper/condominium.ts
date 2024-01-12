import { Condominium } from '@registry:app/entities/condominium';

interface IConvertToObject {
	id?: string;
	name: string;
	CEP: string;
	num: number;
	CNPJ: string;
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
			num: input.num.value,
			CEP: input.CEP.value,
			name: input.name.value,
			CNPJ: input.CNPJ.value,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}
}
