import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '../entities';

export class Code {
	constructor(private readonly _value: string) {
		if (_value.length > 100 || _value.length < 6)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in Code value.',
			});
	}

	public equalTo(input: Code) {
		return input.value() === this._value;
	}

	public value(): string {
		return this._value;
	}
}
