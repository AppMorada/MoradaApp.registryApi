import { EntitieError } from '@app/errors/entities';
import { ApartmentNumber } from './apartmentNumber';

describe('ApartmentNumber Value Object test', () => {
	it('should be able to create ApartmentNumber', () => {
		const sut1 = new ApartmentNumber(2147483647);
		const sut2 = new ApartmentNumber(2147483647);

		expect(sut1).toBeInstanceOf(ApartmentNumber);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new ApartmentNumber(2147483648)).toThrowError(
			EntitieError,
		);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new ApartmentNumber(-1)).toThrowError(EntitieError);
	});
});
