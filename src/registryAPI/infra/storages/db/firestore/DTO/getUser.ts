import { Timestamp } from 'firebase-admin/firestore';
import { IIncomingFirestoreUserData } from '../mapper/users';
import { z } from 'zod';
import { userDTORules } from '@registry:app/entities/user';

export class FirestoreGetUserDTO {
	/**
	 * Valida o retorno dos dados vindos do firestore
	 * @param input - Deve conter os dados a ser validado
	 **/
	static exec(input: any) {
		const schema = z.object({
			id: z.string().uuid(),
			name: z
				.string()
				.min(userDTORules.name.minLength)
				.max(userDTORules.name.maxLength),
			email: z.string().email(),
			password: z
				.string()
				.min(userDTORules.password.minLength)
				.max(userDTORules.password.maxLength),
			CPF: z.string().length(userDTORules.CPF.minLength),
			phoneNumber: z
				.string()
				.min(userDTORules.phoneNumber.minLength)
				.max(userDTORules.phoneNumber.maxLength),
			createdAt: z.instanceof(Timestamp),
			updatedAt: z.instanceof(Timestamp),
		});
		schema.parse(input);

		return input as IIncomingFirestoreUserData;
	}
}
