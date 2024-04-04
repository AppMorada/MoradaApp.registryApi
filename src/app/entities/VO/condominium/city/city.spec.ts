import { EntitieError } from '@app/errors/entities';
import { City } from '.';

describe('City Value Object test', () => {
	it('should be able to create city', () => {
		const sut1 = new City('1234');
		const sut2 = new City('1234');

		expect(sut1).toBeInstanceOf(City);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new City('1'.repeat(241))).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new City('123')).toThrow(EntitieError);
	});
});
