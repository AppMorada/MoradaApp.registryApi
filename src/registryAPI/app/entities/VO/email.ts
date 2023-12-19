import { EntitieError } from '@registry:app/errors/entities';
import { EntitiesEnum } from '../entities';

export class Email {
	constructor(private readonly _value: string) {
		if (_value.length > 320)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in Email value.',
			});
	}

	public equalTo(input: Email) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
