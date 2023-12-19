import { CPF } from '@registry:app/entities/VO/CPF';
import { ApartmentNumber } from '@registry:app/entities/VO/apartmentNumber';
import { Block } from '@registry:app/entities/VO/block';
import { Email } from '@registry:app/entities/VO/email';
import { Level } from '@registry:app/entities/VO/level';
import { Name } from '@registry:app/entities/VO/name';
import { Password } from '@registry:app/entities/VO/password';
import { PhoneNumber } from '@registry:app/entities/VO/phoneNumber';
import { User } from '@registry:app/entities/user';
import { IUserInObject } from '@registry:app/mapper/user';
import { Timestamp } from 'firebase-admin/firestore';

export interface IIncomingFirebaseUserData {
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
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export class UserFirestoreMapper {
	static toDefaultClass(input: IIncomingFirebaseUserData): User {
		return new User(
			{
				name: new Name(input.name),
				email: new Email(input.email),
				password: new Password(input.password),
				CPF: new CPF(input.CPF),
				phoneNumber: new PhoneNumber(input.phoneNumber),
				level: new Level(input.level),
				condominiumId: input.condominiumId,
				block: input.block ? new Block(input.block) : null,
				apartmentNumber: input.apartmentNumber
					? new ApartmentNumber(input.apartmentNumber)
					: null,
				createdAt: input.createdAt.toDate(),
				updatedAt: input.updatedAt.toDate(),
			},
			input.id,
		);
	}

	static toDefaultObject(input: IIncomingFirebaseUserData): IUserInObject {
		return {
			...input,
			createdAt: input.createdAt.toDate(),
			updatedAt: input.updatedAt.toDate(),
		};
	}
}
