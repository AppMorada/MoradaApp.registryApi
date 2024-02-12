import { User } from '@app/entities/user';
import { User as UserPrisma } from '@prisma/client';

export class UserPrismaMapper {
	/**
	 * Mapeia os dados inseridos e os adapta para a utilização no prisma
	 * @param input - Deve conter os dados de entrada do usuário
	 **/
	static toPrisma(input: User): UserPrisma {
		return {
			id: input.id.value,
			name: input.name.value,
			email: input.email.value,
			password: input.password.value,
			CPF: input.CPF.value,
			phoneNumber: input.phoneNumber.value,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}

	/**
	 * Mapeia os dados vindos do prisma em classes
	 * @param input - Deve conter os dados vindos do prisma
	 **/
	static toClass(input: UserPrisma): User {
		return new User(
			{
				name: input.name,
				email: input.email,
				password: input.password,
				CPF: input.CPF,
				phoneNumber: input.phoneNumber,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}
}
