import { CEP } from '@registry:app/entities/VO/CEP';
import { CNPJ } from '@registry:app/entities/VO/CNPJ';
import { Name } from '@registry:app/entities/VO/name';
import { Num } from '@registry:app/entities/VO/num';
import { Condominium } from '@registry:app/entities/condominium';
import { Condominium as CondominiumPrisma } from '@prisma/client';

export class CondominiumPrismaMapper {
	static toPrisma(input: Condominium): CondominiumPrisma {
		return {
			id: input.id,
			name: input.name.value,
			CNPJ: input.CNPJ.value,
			CEP: input.CEP.value,
			num: input.num.value,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}

	static toClass(input: CondominiumPrisma): Condominium {
		return new Condominium(
			{
				name: new Name(input.name),
				CEP: new CEP(input.CEP),
				CNPJ: new CNPJ(input.CNPJ),
				num: new Num(input.num),
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}
}
