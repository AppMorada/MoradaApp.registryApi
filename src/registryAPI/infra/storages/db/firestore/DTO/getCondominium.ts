import { Timestamp } from 'firebase-admin/firestore';
import { IIncomingFirestoreCondominiumData } from '../mapper/condominiums';
import { z } from 'zod';
import { condominiumDTORules } from '@registry:app/entities/condominium';

export class FirestoreGetCondominiumDTO {
	/**
	 * Valida o retorno dos dados vindos do firestore
	 * @param input - Deve conter os dados a ser validado
	 **/
	static exec(input: any) {
		const schema = z.object({
			id: z.string().uuid(),
			name: z
				.string()
				.min(condominiumDTORules.name.minLength)
				.max(condominiumDTORules.name.maxLength),
			CEP: z.string().length(condominiumDTORules.CEP.minLength),
			CNPJ: z.string().length(condominiumDTORules.CNPJ.minLength),
			num: z
				.number()
				.min(condominiumDTORules.num.minLength)
				.max(condominiumDTORules.num.maxLength),
			createdAt: z.instanceof(Timestamp),
			updatedAt: z.instanceof(Timestamp),
		});
		schema.parse(input);

		return input as IIncomingFirestoreCondominiumData;
	}
}
