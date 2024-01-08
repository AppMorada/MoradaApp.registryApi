import { firestoreUserFactory } from '@registry:tests/factories/firestore/user';
import { UserFirestoreMapper } from '../users';

describe('Users Firestore mapper test', () => {
	it('should be able to create a user in firestore object and convert to common user class', () => {
		const sut1 = firestoreUserFactory();
		const sut2 = UserFirestoreMapper.fromFirebaseToClass(sut1);

		expect(sut1.id === sut2.id.value).toBeTruthy();
		expect(sut1.name === sut2.name.value).toBeTruthy();
		expect(sut1.email === sut2.email.value).toBeTruthy();
		expect(sut1.password === sut2.password.value).toBeTruthy();
		expect(sut1.CPF === sut2.CPF.value).toBeTruthy();

		expect(
			sut1.createdAt.toDate().getTime() === sut2.createdAt.getTime(),
		).toBeTruthy();
		expect(
			sut1.updatedAt.toDate().getTime() === sut2.updatedAt.getTime(),
		).toBeTruthy();
		expect(sut1.phoneNumber === sut2.phoneNumber.value).toBeTruthy();
	});

	it('should be able to create a user in firestore object and convert to common user object', () => {
		const sut1 = firestoreUserFactory();
		const sut2 = UserFirestoreMapper.fromFirebaseToObject(sut1);

		expect(sut1.id === sut2.id).toBeTruthy();
		expect(sut1.name === sut2.name).toBeTruthy();
		expect(sut1.email === sut2.email).toBeTruthy();
		expect(sut1.password === sut2.password).toBeTruthy();
		expect(sut1.CPF === sut2.CPF).toBeTruthy();

		expect(
			sut1.createdAt.toDate().getTime() === sut2.createdAt?.getTime(),
		).toBeTruthy();
		expect(
			sut1.updatedAt.toDate().getTime() === sut2.updatedAt?.getTime(),
		).toBeTruthy();
		expect(sut1.phoneNumber === sut2.phoneNumber).toBeTruthy();
	});
});
