import { EntitieError } from '@registry:app/errors/entities';
import { PhoneNumber } from './phoneNumber';

describe('PhoneNumber Value Object test', () => {
	it('should be able to create PhoneNumber', () => {
		const sut1 = new PhoneNumber('1234567891');
		const sut2 = new PhoneNumber('1234567891');

		expect(sut1).toBeInstanceOf(PhoneNumber);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new PhoneNumber('123456789')).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new PhoneNumber('A'.repeat(31))).toThrow(EntitieError);
	});
});
