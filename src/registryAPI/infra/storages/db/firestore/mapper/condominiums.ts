import { Condominium } from '@registry:app/entities/condominium';
import { TCondominiumInObject } from '@registry:app/mapper/condominium';
import { Timestamp } from 'firebase-admin/firestore';

export interface IIncomingFirestoreCondominiumData {
	id: string;
	name: string;
	CEP: string;
	num: number;
	CNPJ: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

export class CondominiumFirestoreMapper {
	/**
	 * Mapeia os dados vindos do firestore e os transforma em classe
	 * @param input - Deve conter os dados vindos do firestore
	 **/
	static fromFirestoreToClass(
		input: IIncomingFirestoreCondominiumData,
	): Condominium {
		return new Condominium(
			{
				CEP: input.CEP,
				CNPJ: input.CNPJ,
				num: input.num,
				name: input.name,
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
	static fromFirestoreToObject(
		input: IIncomingFirestoreCondominiumData,
	): TCondominiumInObject {
		return {
			...input,
			createdAt: input.createdAt.toDate(),
			updatedAt: input.updatedAt.toDate(),
		};
	}
}
