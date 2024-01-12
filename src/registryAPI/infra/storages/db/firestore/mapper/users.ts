import { User } from '@registry:app/entities/user';
import { TUserClassToObject } from '@registry:app/mapper/user';
import { Timestamp } from 'firebase-admin/firestore';

export interface IIncomingFirestoreUserData {
	id: string;
	name: string;
	email: string;
	password: string;
	CPF: string;
	phoneNumber: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export class UserFirestoreMapper {
	/**
	 * Mapeia os dados vindos do firestore e os transforma em classe
	 * @param input - Deve conter os dados vindos do firestore
	 **/
	static fromFirebaseToClass(input: IIncomingFirestoreUserData): User {
		return new User(
			{
				...input,
				createdAt: input.createdAt.toDate(),
				updatedAt: input.updatedAt.toDate(),
			},
			input.id,
		);
	}

	/**
	 * Mapeia os dados vindos do firestore e os transforma em objeto
	 * @param input - Deve conter os dados vindos do firestore
	 **/
	static fromFirebaseToObject(
		input: IIncomingFirestoreUserData,
	): TUserClassToObject {
		return {
			...input,
			createdAt: input.createdAt.toDate(),
			updatedAt: input.updatedAt.toDate(),
		};
	}
}
