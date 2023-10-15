import { EntitieError } from '@app/errors/entities';
import { Email } from './email';

describe('Email Value Object test', () => {
	it('should be able to create Email', () => {
		const sut1 = new Email('a@a.com');
		const sut2 = new Email('a@a.com');

		expect(sut1).toBeInstanceOf(Email);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Email('a@a.co')).toThrowError(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Email('A'.repeat(256))).toThrowError(EntitieError);
	});
});
