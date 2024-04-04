import { EntitieError } from '@app/errors/entities';
import { District } from '.';

describe('District Value Object test', () => {
	it('should be able to create district', () => {
		const sut1 = new District('1234');
		const sut2 = new District('1234');

		expect(sut1).toBeInstanceOf(District);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new District('1'.repeat(241))).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new District('123')).toThrow(EntitieError);
	});
});
