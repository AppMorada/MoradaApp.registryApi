import { CondominiumFirestoreMapper } from '../condominiums';
import { firestoreCondominiumFactory } from '@registry:tests/factories/firestore/condominium';

describe('Condominiums Firestore mapper test', () => {
	it('should be able to create a condominium in firestore object and convert to common class', () => {
		const sut1 = firestoreCondominiumFactory();
		const sut2 = CondominiumFirestoreMapper.fromFirestoreToClass(sut1);

		expect(sut1.id === sut2.id.value).toBeTruthy();
		expect(sut1.name === sut2.name.value).toBeTruthy();
		expect(sut1.num === sut2.num.value).toBeTruthy();
		expect(sut1.CEP === sut2.CEP.value).toBeTruthy();
		expect(sut1.CNPJ === sut2.CNPJ.value).toBeTruthy();

		expect(
			sut1.createdAt.toDate().getTime() === sut2.createdAt.getTime(),
		).toBeTruthy();
		expect(
			sut1.updatedAt.toDate().getTime() === sut2.updatedAt.getTime(),
		).toBeTruthy();
	});

	it('should be able to create a condominium in firestore object and convert to common condominium object', () => {
		const sut1 = firestoreCondominiumFactory();
		const sut2 = CondominiumFirestoreMapper.fromFirestoreToObject(sut1);

		expect(sut1.id === sut2.id).toBeTruthy();
		expect(sut1.name === sut2.name).toBeTruthy();
		expect(sut1.num === sut2.num).toBeTruthy();
		expect(sut1.CEP === sut2.CEP).toBeTruthy();
		expect(sut1.CNPJ === sut2.CNPJ).toBeTruthy();
		expect(
			sut1.createdAt.toDate().getTime() === sut2.createdAt?.getTime(),
		).toBeTruthy();
		expect(
			sut1.updatedAt.toDate().getTime() === sut2.updatedAt?.getTime(),
		).toBeTruthy();
	});
});
