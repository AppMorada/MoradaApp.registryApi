import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '../entities';

export class CNPJ {
	constructor(private readonly _value: string) {
		if (_value.length !== 15)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in CNPJ value.',
			});
	}

	public equalTo(input: CNPJ) {
		return input.value() === this._value;
	}

	public value(): string {
		return this._value;
	}
}
