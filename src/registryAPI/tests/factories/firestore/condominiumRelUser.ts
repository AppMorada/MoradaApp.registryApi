import { UUID } from '@registry:app/entities/VO';
import { IIncomingFirestoreCondominiumRelUserData } from '@registry:infra/storages/db/firestore/mapper/condominiumRelUser';
import { Timestamp } from 'firebase-admin/firestore';

type TOverride = Partial<IIncomingFirestoreCondominiumRelUserData>;

export function firestoreCondominiumRelUserFactory(
	input: TOverride = {},
): IIncomingFirestoreCondominiumRelUserData {
	return {
		id: UUID.genV4().value,
		block: 'A12',
		apartmentNumber: 110,
		level: 0,
		updatedAt: new Timestamp(1000, 10),
		condominiumId: UUID.genV4().value,
		userId: UUID.genV4().value,
		...input,
	};
}
