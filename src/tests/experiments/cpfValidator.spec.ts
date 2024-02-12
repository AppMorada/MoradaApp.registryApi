import { CPF } from '@app/entities/VO';
import { EntitiesEnum } from '@app/entities/entities';
import { EntitieError } from '@app/errors/entities';

describe('CPF validator test', () => {
	it('should be able to validate CPF', () => {
		expect(() => new CPF('111.222.333-96')).not.toThrow();
		expect(() => new CPF('111.222.333-95')).toThrow(
			new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de CPF',
			}),
		);

		expect(() => new CPF('347.912.188-84')).not.toThrow();
		expect(() => new CPF('347.912.188-85')).toThrow(
			new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de CPF',
			}),
		);

		expect(() => new CPF('423.286.676-00')).not.toThrow();
		expect(() => new CPF('423.286.676-01')).toThrow(
			new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de CPF',
			}),
		);

		expect(() => new CPF('477.473.072-68')).not.toThrow();
		expect(() => new CPF('477.473.072-69')).toThrow(
			new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de CPF',
			}),
		);
	});
});
