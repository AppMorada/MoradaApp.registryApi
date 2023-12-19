import { CEP } from '@registry:app/entities/VO/CEP';
import { CNPJ } from '@registry:app/entities/VO/CNPJ';
import { Name } from '@registry:app/entities/VO/name';
import { Num } from '@registry:app/entities/VO/num';
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

type TClassTOObject = Required<IConvertToObject>;

export class CondominiumMapper {
	static toClass(input: IConvertToObject): Condominium {
		return new Condominium(
			{
				name: new Name(input.name),
				CNPJ: new CNPJ(input.CNPJ),
				CEP: new CEP(input.CEP),
				num: new Num(input.num),
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}

	static toObject(input: Condominium): TClassTOObject {
		return {
			id: input.id,
			num: input.num.value,
			CEP: input.CEP.value,
			name: input.name.value,
			CNPJ: input.CNPJ.value,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}
}
