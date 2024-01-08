import { CondominiumRelUser } from '@registry:app/entities/condominiumRelUser';
import { CondominiumRelUser as CondominiumRelUserPrisma } from '@prisma/client';

export class CondominiumRelUserPrismaMapper {
	/**
	 * Mapeia os dados inseridos e os adapta para a utilização no prisma
	 * @param input - Deve conter os dados de entrada do CondominiumRelUser
	 **/
	static toPrisma(input: CondominiumRelUser): CondominiumRelUserPrisma {
		return {
			id: input.id.value,
			condominiumId: input.condominiumId.value,
			userId: input.userId.value,
			block: input.block?.value ?? null,
			level: input.level.value,
			apartment_number: input.apartmentNumber?.value ?? null,
			updatedAt: input.updatedAt,
		};
	}

	/**
	 * Mapeia os dados vindos do prisma em classes
	 * @param input - Deve conter os dados vindos do prisma
	 **/
	static toClass(input: CondominiumRelUserPrisma): CondominiumRelUser {
		return new CondominiumRelUser(
			{
				userId: input.userId,
				condominiumId: input.condominiumId,
				apartmentNumber: input.apartment_number,
				updatedAt: input.updatedAt,
				block: input.block,
				level: input.level,
			},
			input.id,
		);
	}
}
