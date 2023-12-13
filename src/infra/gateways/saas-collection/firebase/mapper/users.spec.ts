import { firestoreUserFactory } from '@tests/factories/firestoreUser';
import { UserFirestoreMapper } from './users';

describe('Users Firestore mapper test', () => {
	it('should be able to create a user in firestore and convert to common user class', () => {
		const sut1 = firestoreUserFactory();
		const sut2 = UserFirestoreMapper.toDefaultClass(sut1);

		expect(sut1.id === sut2.id).toBeTruthy();
		expect(sut1.condominiumId === sut2.condominiumId).toBeTruthy();
		expect(sut1.name === sut2.name.value).toBeTruthy();
		expect(sut1.email === sut2.email.value).toBeTruthy();
		expect(sut1.password === sut2.password.value).toBeTruthy();
		expect(sut1.CPF === sut2.CPF.value).toBeTruthy();
		expect(sut1.block === sut2.block?.value).toBeTruthy();
		expect(sut1.level === sut2.level.value).toBeTruthy();
		expect(
			sut1.createdAt.toDate().toString() === sut2.createdAt.toString(),
		).toBeTruthy();
		expect(
			sut1.updatedAt.toDate().toString() === sut2.updatedAt.toString(),
		).toBeTruthy();
		expect(sut1.phoneNumber === sut2.phoneNumber.value).toBeTruthy();
		expect(
			sut1.apartmentNumber === sut2.apartmentNumber?.value,
		).toBeTruthy();
	});

	it('should be able to create a user in firestore and convert to common user object', () => {
		const sut1 = firestoreUserFactory();
		const sut2 = UserFirestoreMapper.toDefaultObject(sut1);

		expect(sut1.id === sut2.id).toBeTruthy();
		expect(sut1.condominiumId === sut2.condominiumId).toBeTruthy();
		expect(sut1.name === sut2.name).toBeTruthy();
		expect(sut1.email === sut2.email).toBeTruthy();
		expect(sut1.password === sut2.password).toBeTruthy();
		expect(sut1.CPF === sut2.CPF).toBeTruthy();
		expect(sut1.block === sut2.block).toBeTruthy();
		expect(sut1.level === sut2.level).toBeTruthy();
		expect(
			sut1.createdAt.toDate().toString() === sut2.createdAt?.toString(),
		).toBeTruthy();
		expect(
			sut1.updatedAt.toDate().toString() === sut2.updatedAt?.toString(),
		).toBeTruthy();
		expect(sut1.phoneNumber === sut2.phoneNumber).toBeTruthy();
		expect(sut1.apartmentNumber === sut2.apartmentNumber).toBeTruthy();
	});
});
