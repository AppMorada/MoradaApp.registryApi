import { Condominium } from '@app/entities/condominium';

export interface IConvertToObject {
	id?: string;
	humanReadableId?: string;
	ownerId: string;
	name: string;
	CEP: string;
	num: number;
	CNPJ: string;
	reference?: string | null;
	district: string;
	state: string;
	city: string;
	complement?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

export type TCondominiumInObject = {
	id: string;
	humanReadableId: string;
	ownerId: string;
	name: string;
	CEP: string;
	num: number;
	CNPJ: string;
	reference?: string | null;
	district: string;
	state: string;
	city: string;
	complement?: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export class CondominiumMapper {
	static toClass(input: IConvertToObject): Condominium {
		return new Condominium({ ...input }, input.id);
	}

	static toObject(input: Condominium): TCondominiumInObject {
		return {
			id: input.id.value,
			humanReadableId: input.humanReadableId,
			ownerId: input.ownerId.value,
			num: input.num.value,
			CEP: input.CEP.value,
			name: input.name.value,
			CNPJ: input.CNPJ.value,
			reference: input.reference
				? input.reference.value
				: input.reference,
			complement: input.complement
				? input.complement.value
				: input.complement,
			city: input.city.value,
			district: input.district.value,
			state: input.state.value,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}
}
