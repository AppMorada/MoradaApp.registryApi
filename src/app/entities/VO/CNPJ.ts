import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '../entities';

export class CNPJ {
	constructor(private readonly _value: string) {
		this._value = _value.replaceAll(/[./-]/g, '');

		if (this._value.length !== 14)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in CNPJ value.',
			});
	}

	public equalTo(input: CNPJ) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
