import { CPF } from '@app/entities/VO/CPF';
import { Email } from '@app/entities/VO/email';
import { Level } from '@app/entities/VO/level';
import { Name } from '@app/entities/VO/name';
import { Password } from '@app/entities/VO/password';
import { PhoneNumber } from '@app/entities/VO/phoneNumber';
import { User } from '../entities/user';
import { ApartmentNumber } from '@app/entities/VO/apartmentNumber';
import { Block } from '@app/entities/VO/block';

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
