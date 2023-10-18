import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '../entities';

export class CEP {
	constructor(private readonly _value: string) {
		this._value = _value.replace(/[-]/g, '');

		if (this._value.length !== 8)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in CEP value.',
			});
	}

	public equalTo(input: CEP) {
		return input.value() === this._value;
	}

	public value(): string {
		return this._value;
	}
}
