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
