import { Condominium } from '@app/entities/condominium';
import { Condominium as CondominiumPrisma } from '@prisma/client';

export class CondominiumPrismaMapper {
	/**
	 * Mapeia os dados inseridos e os adapta para a utilização no prisma
	 * @param input - Deve conter os dados de entrada do condomínio
	 **/
	static toPrisma(input: Condominium): CondominiumPrisma {
		return {
			id: input.id.value,
			name: input.name.value,
			CNPJ: input.CNPJ.value,
			CEP: input.CEP.value,
			num: input.num.value,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}

	/**
	 * Mapeia os dados vindos do prisma em classes
	 * @param input - Deve conter os dados vindos do prisma
	 **/
	static toClass(input: CondominiumPrisma): Condominium {
		return new Condominium(
			{
				name: input.name,
				CEP: input.CEP,
				CNPJ: input.CNPJ,
				num: input.num,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}
}
