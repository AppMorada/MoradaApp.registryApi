import { CPF } from '@app/entities/VO/CPF';
import { EntitiesEnum } from '@app/entities/entities';
import { EntitieError } from '@app/errors/entities';

describe('CPF validator test', () => {
	it('should be able to validate CPF', () => {
		expect(() => new CPF('111.222.333-96')).not.toThrowError();
		expect(() => new CPF('111.222.333-95')).toThrowError(
			new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Invalid CPF.',
			}),
		);

		expect(() => new CPF('347.912.188-84')).not.toThrowError();
		expect(() => new CPF('347.912.188-85')).toThrowError(
			new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Invalid CPF.',
			}),
		);

		expect(() => new CPF('423.286.676-00')).not.toThrowError();
		expect(() => new CPF('423.286.676-01')).toThrowError(
			new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Invalid CPF.',
			}),
		);

		expect(() => new CPF('477.473.072-68')).not.toThrowError();
		expect(() => new CPF('477.473.072-69')).toThrowError(
			new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Invalid CPF.',
			}),
		);
	});
});
