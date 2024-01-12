import { UUID } from '@registry:app/entities/VO';
import { IIncomingFirestoreInviteData } from '@registry:infra/storages/db/firestore/mapper/invite';
import { Timestamp } from 'firebase-admin/firestore';

type TOverride = Partial<IIncomingFirestoreInviteData>;

export function firestoreInviteFactory(
	input: TOverride = {},
): IIncomingFirestoreInviteData {
	return {
		id: UUID.genV4().value,
		ttl: 1000,
		email: 'johndoe@email.com',
		type: 0,
		condominiumId: UUID.genV4().value,
		expiresAt: new Timestamp(1000, 10),
		...input,
	};
}
