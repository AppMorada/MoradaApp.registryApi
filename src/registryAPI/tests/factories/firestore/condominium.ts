import { UUID } from '@registry:app/entities/VO';
import { IIncomingFirestoreCondominiumData } from '@registry:infra/storages/db/firestore/mapper/condominiums';
import { Timestamp } from 'firebase-admin/firestore';

type TOverride = Partial<IIncomingFirestoreCondominiumData>;

export function firestoreCondominiumFactory(
	input: TOverride = {},
): IIncomingFirestoreCondominiumData {
	return {
		id: UUID.genV4().value,
		name: 'Condominium',
		num: 1000,
		CNPJ: '70468591000101',
		CEP: '69092440',
		createdAt: new Timestamp(1000, 10),
		updatedAt: new Timestamp(1000, 10),
		...input,
	};
}
