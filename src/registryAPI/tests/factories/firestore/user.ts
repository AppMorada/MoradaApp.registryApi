import { UUID } from '@registry:app/entities/VO';
import { IIncomingFirestoreUserData } from '@registry:infra/storages/db/firestore/mapper/users';
import { Timestamp } from 'firebase-admin/firestore';

type TOverride = Partial<IIncomingFirestoreUserData>;

export function firestoreUserFactory(
	input: TOverride = {},
): IIncomingFirestoreUserData {
	return {
		id: UUID.genV4().value,
		name: 'John Doe',
		email: 'jhondoe@email.com',
		password: '12345678',
		phoneNumber: '1234567891',
		CPF: '11122233396',
		createdAt: new Timestamp(1000, 10),
		updatedAt: new Timestamp(1000, 10),
		...input,
	};
}
