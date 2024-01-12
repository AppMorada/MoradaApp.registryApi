import { Timestamp } from 'firebase-admin/firestore';
import { Invite } from '@registry:app/entities/invite';
import { TInviteInObject } from '@registry:app/mapper/invite';

export interface IIncomingFirestoreInviteData {
	id: string;
	email: string;
	ttl: number;
	expiresAt: Timestamp;
	condominiumId: string;
	type: number;
}

export class InviteFirestoreMapper {
	/**
	 * Mapeia os dados vindos do firestore e os transforma em classe
	 * @param input - Deve conter os dados vindos do firestore
	 **/
	static fromFirestoreToClass(input: IIncomingFirestoreInviteData): Invite {
		return new Invite(
			{
				...input,
				expiresAt: input.expiresAt.toDate(),
			},
			input.id,
		);
	}

	/**
	 * Mapeia os dados vindos do firestore e os transforma em objeto
	 * @param input - Deve conter os dados vindos do firestore
	 **/
	static fromFirestoreToObject(
		input: IIncomingFirestoreInviteData,
	): TInviteInObject {
		return {
			...input,
			ttl: input.ttl,
			expiresAt: input.expiresAt.toDate(),
		};
	}
}
