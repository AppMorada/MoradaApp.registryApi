import { EntitieError } from '@app/errors/entities';
import { CPF } from './CPF';

describe('CPF Value Object test', () => {
	it('should be able to create CPF', () => {
		const sut1 = new CPF('12345678912');
		const sut2 = new CPF('12345678912');

		expect(sut1).toBeInstanceOf(CPF);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new CPF('1234567891')).toThrowError(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new CPF('123456789123')).toThrowError(EntitieError);
	});
});
