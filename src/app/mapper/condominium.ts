import { CEP } from '@app/entities/VO/CEP';
import { CNPJ } from '@app/entities/VO/CNPJ';
import { Block } from '@app/entities/VO/block';
import { Name } from '@app/entities/VO/name';
import { Num } from '@app/entities/VO/num';
import { Condominium } from '@app/entities/condominium';

interface IConvertToObject {
	id?: string;
	name: string;
	CEP: string;
	num: number;
	block: string;
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
				block: new Block(input.block),
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
			block: input.block.value,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}
}
