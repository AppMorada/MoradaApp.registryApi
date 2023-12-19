import { EntitieError } from '@registry:app/errors/entities';
import { CPF } from './CPF';

describe('CPF Value Object test', () => {
	it('should be able to create CPF', () => {
		const sut1 = new CPF('11122233396');
		const sut2 = new CPF('11122233396');

		expect(sut1).toBeInstanceOf(CPF);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new CPF('1112223339')).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new CPF('111222333966')).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new CPF('11122233395')).toThrow(EntitieError);
	});
});
