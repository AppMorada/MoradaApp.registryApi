import { CEP } from '@app/entities/VO';

describe('CEP test', () => {
	it('should be able to format a CEP', () => {
		const cep = new CEP('02989-010');
		const int = CEP.toInt(cep);
		const str = CEP.toString(int);

		expect(str === cep.value);
	});
});
