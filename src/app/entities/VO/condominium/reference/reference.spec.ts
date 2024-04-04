import { EntitieError } from '@app/errors/entities';
import { Reference } from '.';

describe('Reference Value Object test', () => {
	it('should be able to create reference', () => {
		const sut1 = new Reference('123456');
		const sut2 = new Reference('123456');

		expect(sut1).toBeInstanceOf(Reference);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Reference('1'.repeat(61))).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Reference('12345')).toThrow(EntitieError);
	});
});
