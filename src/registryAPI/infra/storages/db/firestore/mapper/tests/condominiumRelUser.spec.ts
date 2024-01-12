import { firestoreCondominiumRelUserFactory } from '@registry:tests/factories/firestore/condominiumRelUser';
import { CondominiumRelUserFirestoreMapper } from '../condominiumRelUser';

describe('CondominiumRelUser Firestore mapper test', () => {
	it('should be able to create a condominium rel user in firestore object and convert to common class', () => {
		const sut1 = firestoreCondominiumRelUserFactory();
		const sut2 =
			CondominiumRelUserFirestoreMapper.fromFirestoreToClass(sut1);

		expect(sut1.id === sut2.id.value).toBeTruthy();
		expect(sut1.userId === sut2.userId.value).toBeTruthy();
		expect(sut1.condominiumId === sut2.condominiumId.value).toBeTruthy();
		expect(sut1.level === sut2.level.value).toBeTruthy();
		expect(
			sut1.apartmentNumber === sut2.apartmentNumber?.value,
		).toBeTruthy();
		expect(sut1.block === sut2.block?.value).toBeTruthy();
		expect(
			sut1.updatedAt.toDate().getTime() === sut2.updatedAt.getTime(),
		).toBeTruthy();
	});

	it('should be able to create a condominium in firestore object and convert to common condominium object', () => {
		const sut1 = firestoreCondominiumRelUserFactory();
		const sut2 =
			CondominiumRelUserFirestoreMapper.fromFirestoreToObject(sut1);

		expect(sut1.id === sut2.id).toBeTruthy();
		expect(sut1.userId === sut2.userId).toBeTruthy();
		expect(sut1.condominiumId === sut2.condominiumId).toBeTruthy();
		expect(sut1.level === sut2.level).toBeTruthy();
		expect(sut1.apartmentNumber === sut2.apartmentNumber).toBeTruthy();
		expect(sut1.block === sut2.block).toBeTruthy();
		expect(
			sut1.updatedAt.toDate().getTime() === sut2.updatedAt?.getTime(),
		).toBeTruthy();
	});
});
