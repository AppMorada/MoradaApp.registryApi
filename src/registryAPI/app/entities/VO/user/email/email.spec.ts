import { EntitieError } from '@registry:app/errors/entities';
import { Email } from '.';

describe('Email Value Object test', () => {
	it('should be able to create Email', () => {
		const sut1 = new Email('a'.repeat(320));
		const sut2 = new Email('a'.repeat(320));

		expect(sut1).toBeInstanceOf(Email);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Email('A'.repeat(321))).toThrow(EntitieError);
	});
});
