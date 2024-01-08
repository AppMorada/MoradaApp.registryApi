import { Timestamp } from 'firebase-admin/firestore';
import { IIncomingFirestoreInviteData } from '../mapper/invite';
import { z } from 'zod';
import { condominiumRelUserDTORules } from '@registry:app/entities/condominiumRelUser';

export class FirestoreGetInviteDTO {
	/**
	 * Valida o retorno dos dados vindos do firestore
	 * @param input - dado a ser validado
	 **/
	static exec(input: any) {
		const schema = z.object({
			id: z.string().uuid(),
			condominiumId: z.string().uuid(),
			ttl: z
				.number()
				.max(1000 * 60 * 60 * 24 * 10)
				.min(0),
			type: z
				.number()
				.min(condominiumRelUserDTORules.level.minLength)
				.max(condominiumRelUserDTORules.level.maxLength),
			email: z.string().email(),
			expiresAt: z.instanceof(Timestamp),
		});
		schema.parse(input);

		return input as IIncomingFirestoreInviteData;
	}
}
