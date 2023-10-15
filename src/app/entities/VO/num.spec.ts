import { EntitieError } from '@app/errors/entities';
import { Num } from './num';

describe('Num Value Object test', () => {
	it('should be able to create Num', () => {
		const sut1 = new Num(251);
		const sut2 = new Num(251);

		expect(sut1).toBeInstanceOf(Num);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Num(32769)).toThrowError(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Num(-1)).toThrowError(EntitieError);
	});
});
