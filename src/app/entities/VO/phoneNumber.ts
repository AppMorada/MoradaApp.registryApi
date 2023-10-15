import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '../entities';

export class PhoneNumber {
	constructor(private readonly _value: string) {
		if (_value.length > 30 || _value.length < 10)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in PhoneNumber value.',
			});
	}

	public equalTo(input: PhoneNumber) {
		return input.value() === this._value;
	}

	public value(): string {
		return this._value;
	}
}
