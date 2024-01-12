import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { IIncomingFirestoreCondominiumRelUserData } from '../mapper/condominiumRelUser';
import { condominiumRelUserDTORules } from '@registry:app/entities/condominiumRelUser';

export class FirestoreGetCondominiumRelUserDTO {
	/**
	 * Valida o retorno dos dados vindos do firestore
	 * @param input - Deve conter os dados a ser validado
	 **/
	static exec(input: any) {
		const schema = z.object({
			apartmentNumber: z.optional(
				z
					.number()
					.min(condominiumRelUserDTORules.apartmentNumber.minLength)
					.max(condominiumRelUserDTORules.apartmentNumber.maxLength),
			),
			block: z.optional(
				z.string().max(condominiumRelUserDTORules.block.maxLength),
			),
			level: z.optional(
				z
					.number()
					.min(condominiumRelUserDTORules.level.minLength)
					.max(condominiumRelUserDTORules.level.maxLength),
			),
			updatedAt: z.instanceof(Timestamp),
			userId: z.string().uuid(),
			id: z.string().uuid(),
			condominiumId: z.string().uuid(),
		});
		schema.parse(input);

		return input as IIncomingFirestoreCondominiumRelUserData;
	}
}
