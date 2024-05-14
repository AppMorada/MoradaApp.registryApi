import { CNPJ } from '@app/entities/VO';
import { EntitiesEnum } from '@app/entities/entities';
import { EntitieError } from '@app/errors/entities';

describe('CNPJ experiments', () => {
	it('should be able to test a CNPJ class', () => {
		expect(() => new CNPJ('94.644.582/0001-92')).not.toThrow();
	});

	it('shoul throw one error because CNPJ is invalid', () => {
		expect(() => new CNPJ('94.644.582/0001-93')).toThrow(
			new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de CNPJ',
			}),
		);
	});
});
