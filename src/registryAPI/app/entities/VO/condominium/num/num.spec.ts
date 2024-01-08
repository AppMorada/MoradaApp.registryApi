import { EntitieError } from '@registry:app/errors/entities';
import { Num } from '.';

describe('Num Value Object test', () => {
	it('should be able to create Num', () => {
		const sut1 = new Num(2147483647);
		const sut2 = new Num(2147483647);

		expect(sut1).toBeInstanceOf(Num);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Num(2147483648)).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Num(-1)).toThrow(EntitieError);
	});
});
