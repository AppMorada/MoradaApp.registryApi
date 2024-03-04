import { EntitieError } from '@app/errors/entities';
import { CEP } from '.';

describe('CEP Value Object test', () => {
	it('should be able to create CEP', () => {
		const sut1 = new CEP('12345678');
		const sut2 = new CEP('12345678');

		expect(sut1).toBeInstanceOf(CEP);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to convert to int and string', () => {
		const sut = new CEP('00089-010');
		const int = CEP.toInt(sut);
		const str = CEP.toString(int);
		expect(str === sut.value);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new CEP('123456789')).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new CEP('1234567')).toThrow(EntitieError);
	});
});
