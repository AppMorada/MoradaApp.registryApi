import { IIncomingFirebaseUserData } from '@registry:infra/gateways/saas-collection/firebase/mapper/users';
import { randomUUID } from 'crypto';
import { Timestamp } from 'firebase-admin/firestore';

type TOverride = Partial<IIncomingFirebaseUserData>;

export function firestoreUserFactory(
	input: TOverride = {},
): IIncomingFirebaseUserData {
	return {
		id: input.id ?? randomUUID(),
		name: 'John Doe',
		email: 'jhondoe@email.com',
		password: '12345678',
		phoneNumber: '1234567891',
		CPF: '11122233396',
		condominiumId: randomUUID(),
		apartmentNumber: 32768,
		block: '180',
		level: input.level ?? 0,
		createdAt: new Timestamp(1000, 10),
		updatedAt: new Timestamp(1000, 10),
		...input,
	};
}
