import { EntitieError } from '@app/errors/entities';
import { Code } from './code';

describe('Code Value Object test', () => {
	it('should be able to create Code', () => {
		const sut1 = new Code('123456');
		const sut2 = new Code('123456');

		expect(sut1).toBeInstanceOf(Code);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Code('1234567')).toThrowError(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new Code('12345')).toThrowError(EntitieError);
	});
});
