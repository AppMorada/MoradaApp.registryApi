import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '../entities';

export class Password {
	constructor(private readonly _value: string) {
		if (_value.length > 64 || _value.length < 8)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in Password value.',
			});
	}

	public equalTo(input: Password) {
		return input.value() === this._value;
	}

	public value(): string {
		return this._value;
	}
}
