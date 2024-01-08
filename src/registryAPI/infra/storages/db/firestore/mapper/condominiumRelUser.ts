import { CondominiumRelUser } from '@registry:app/entities/condominiumRelUser';
import { Timestamp } from 'firebase-admin/firestore';
import { TReplace } from '@registry:utils/replace';
import { TCondominiumRelUserToObject } from '@registry:app/mapper/condominiumRelUser';

export interface IIncomingFirestoreCondominiumRelUserData {
	id: string;
	userId: string;
	condominiumId: string;
	block: string | null;
	apartmentNumber: number | null;
	level: number;
	updatedAt: Timestamp;
}

export type TFirestoreCondominiumRelUserToObject = TReplace<
	IIncomingFirestoreCondominiumRelUserData,
	{ updatedAt: Date }
>;

export class CondominiumRelUserFirestoreMapper {
	/**
	 * Mapeia os dados vindos do firestore e os transforma em classe
	 * @param input - Deve conter os dados vindos do firestore
	 **/
	static fromFirestoreToClass({
		id,
		...input
	}: IIncomingFirestoreCondominiumRelUserData): CondominiumRelUser {
		return new CondominiumRelUser(
			{
				...input,
				updatedAt: input.updatedAt.toDate(),
			},
			id,
		);
	}

	/**
	 * Mapeia os dados vindos do firestore e os transforma em objeto
	 * @param input - Deve conter os dados vindos do firestore
	 **/
	static fromFirestoreToObject(
		input: IIncomingFirestoreCondominiumRelUserData,
	): TCondominiumRelUserToObject {
		return {
			...input,
			updatedAt: input.updatedAt.toDate(),
		};
	}
}
