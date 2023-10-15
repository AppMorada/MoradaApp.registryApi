import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '../entities';

export class CPF {
	constructor(private readonly _value: string) {
		if (_value.length !== 11)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in CPF value.',
			});
	}

	public equalTo(input: CPF) {
		return input.value() === this._value;
	}

	public value(): string {
		return this._value;
	}
}
