import { firestoreInviteFactory } from '@registry:tests/factories/firestore/invite';
import { InviteFirestoreMapper } from '../invite';

describe('Invite Firestore mapper test', () => {
	it('should be able to create a invite in firestore object and convert to common class', () => {
		const sut1 = firestoreInviteFactory();
		const sut2 = InviteFirestoreMapper.fromFirestoreToClass(sut1);

		expect(sut1.id === sut2.id.value).toBeTruthy();
		expect(sut1.email === sut2.email.value).toBeTruthy();
		expect(sut1.type === sut2.type.value).toBeTruthy();
		expect(sut1.condominiumId === sut2.condominiumId.value).toBeTruthy();
		expect(sut1.ttl === sut2.ttl).toBeTruthy();

		expect(
			sut1.expiresAt.toDate().getTime() === sut2.expiresAt.getTime(),
		).toBeTruthy();
	});

	it('should be able to create a invite in firestore object and convert to common object', () => {
		const sut1 = firestoreInviteFactory();
		const sut2 = InviteFirestoreMapper.fromFirestoreToObject(sut1);

		expect(sut1.id === sut2.id).toBeTruthy();
		expect(sut1.email === sut2.email).toBeTruthy();
		expect(sut1.type === sut2.type).toBeTruthy();
		expect(sut1.condominiumId === sut2.condominiumId).toBeTruthy();
		expect(sut1.ttl === sut2.ttl).toBeTruthy();

		expect(
			sut1.expiresAt.toDate().getTime() === sut2.expiresAt.getTime(),
		).toBeTruthy();
	});
});
