import { EntitieError } from '@app/errors/entities';
import { CNPJ } from '.';

describe('CNPJ Value Object test', () => {
	it('should be able to create CNPJ', () => {
		const sut1 = new CNPJ('12345678912345');
		const sut2 = new CNPJ('12345678912345');

		expect(sut1).toBeInstanceOf(CNPJ);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to convert to int and string', () => {
		const sut = new CNPJ('00005678912345');
		const int = CNPJ.toInt(sut);
		const str = CNPJ.toString(int);
		expect(str === sut.value);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new CNPJ('123456789123456')).toThrow(EntitieError);
	});

	it('should be able to throw one error: length error', () => {
		expect(() => new CNPJ('1234567891234')).toThrow(EntitieError);
	});
});
