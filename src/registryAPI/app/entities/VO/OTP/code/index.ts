import { EntitieError } from '@registry:app/errors/entities';
import { EntitiesEnum } from '@registry:app/entities/entities';
import { ValueObject } from '@registry:app/entities/entities';

export class Code implements ValueObject<Code, string> {
	/** @deprecated **/
	constructor(private readonly _value: string) {
		if (_value.length > 100 || _value.length < 6)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in Code value.',
			});
	}

	public equalTo(input: Code) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
