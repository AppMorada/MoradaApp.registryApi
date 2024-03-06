import { CPF } from '.';

describe('CPF Value Object test', () => {
	it('should be able to create CPF', () => {
		const sut1 = new CPF('11122233396');
		const sut2 = new CPF('11122233396');

		expect(sut1).toBeInstanceOf(CPF);
		expect(sut1.equalTo(sut2)).toBeTruthy();
	});

	it('should be able to convert to int and string', () => {
		const sut = new CPF('012.535.604-80');
		const int = CPF.toInt(sut);
		const str = CPF.toString(int);
		expect(str === sut.value);
	});
});
