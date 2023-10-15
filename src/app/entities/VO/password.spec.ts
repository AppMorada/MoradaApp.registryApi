import { EntitieError } from '@app/errors/entities';
import { Password } from './password';

describe('Password Value Object test', () => {
	it('should be able to create Password', () => {
		const sut1 = new Password('12345678');
		const sut2 = new Password('12345678');

		expect(sut1).toBeInstanceOf(Password);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Password('1234567')).toThrowError(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Password('A'.repeat(65))).toThrowError(EntitieError);
	});
});
