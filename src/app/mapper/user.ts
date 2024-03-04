import { User } from '../entities/user';

export interface IUserInObject {
	id?: string;
	name: string;
	email: string;
	password: string;
	CPF: string;
	phoneNumber?: string | null;
	tfa: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export type TUserClassToObject = {
	id: string;
	name: string;
	email: string;
	password: string;
	CPF: string;
	phoneNumber?: string | null;
	tfa: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export class UserMapper {
	/**
	 * Método usado para converter um objeto de usuário em classe
	 * @param input - Deve conter os dados em forma de objeto
	 **/
	static toClass(input: IUserInObject): User {
		return new User(
			{
				...input,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}

	/**
	 * Método usado para converter uma classe de usuário em objeto
	 * @param input - Deve conter os dados em forma de classe
	 **/
	static toObject(input: User): TUserClassToObject {
		return {
			id: input.id.value,
			name: input.name.value,
			email: input.email.value,
			password: input.password.value,
			CPF: input.CPF.value,
			phoneNumber: input.phoneNumber
				? input.phoneNumber.value
				: input.phoneNumber,
			tfa: input.tfa,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}
}
