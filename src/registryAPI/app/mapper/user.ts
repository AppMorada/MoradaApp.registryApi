import { CPF } from '@registry:app/entities/VO/CPF';
import { Email } from '@registry:app/entities/VO/email';
import { Level } from '@registry:app/entities/VO/level';
import { Name } from '@registry:app/entities/VO/name';
import { Password } from '@registry:app/entities/VO/password';
import { PhoneNumber } from '@registry:app/entities/VO/phoneNumber';
import { User } from '../entities/user';
import { ApartmentNumber } from '@registry:app/entities/VO/apartmentNumber';
import { Block } from '@registry:app/entities/VO/block';

export interface IUserInObject {
	id?: string;
	name: string;
	email: string;
	password: string;
	CPF: string;
	phoneNumber: string;
	level: number;
	condominiumId: string;
	block: string | null;
	apartmentNumber: number | null;
	createdAt?: Date;
	updatedAt?: Date;
}

type TClassToObject = {
	id: string;
	name: string;
	email: string;
	password: string;
	CPF: string;
	phoneNumber: string;
	level: number;
	condominiumId: string;
	block: string | null;
	apartmentNumber: number | null;
	createdAt: Date;
	updatedAt: Date;
};

export class UserMapper {
	static toClass(input: IUserInObject): User {
		return new User(
			{
				name: new Name(input.name),
				email: new Email(input.email),
				password: new Password(input.password),
				CPF: new CPF(input.CPF),
				phoneNumber: new PhoneNumber(input.phoneNumber),
				level: new Level(input.level),
				condominiumId: input.condominiumId,
				apartmentNumber: input.apartmentNumber
					? new ApartmentNumber(input.apartmentNumber)
					: null,
				block: input.block ? new Block(input.block) : null,
				createdAt: input.createdAt,
				updatedAt: input.updatedAt,
			},
			input.id,
		);
	}

	static toObject(input: User): TClassToObject {
		return {
			id: input.id,
			name: input.name.value,
			email: input.email.value,
			password: input.password.value,
			CPF: input.CPF.value,
			phoneNumber: input.phoneNumber.value,
			level: input.level.value,
			condominiumId: input.condominiumId,
			apartmentNumber: input.apartmentNumber?.value ?? null,
			block: input.block?.value ?? null,
			createdAt: input.createdAt,
			updatedAt: input.updatedAt,
		};
	}
}
