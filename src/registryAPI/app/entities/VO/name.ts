import { EntitieError } from '@registry:app/errors/entities';
import { EntitiesEnum } from '../entities';

export class Name {
	constructor(private readonly _value: string) {
		if (_value.length > 120 || _value.length < 2)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in Name value.',
			});
	}

	public equalTo(input: Name) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
