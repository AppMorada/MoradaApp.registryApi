import { EntitieError } from '@app/errors/entities';
import { Complement } from '.';

describe('Complement Value Object test', () => {
	it('should be able to create complement', () => {
		const sut1 = new Complement('123');
		const sut2 = new Complement('123');

		expect(sut1).toBeInstanceOf(Complement);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Complement('1'.repeat(61))).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Complement('12')).toThrow(EntitieError);
	});
});
