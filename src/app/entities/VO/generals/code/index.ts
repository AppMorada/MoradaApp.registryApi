import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '@app/entities/entities';
import { ValueObject } from '@app/entities/entities';

export class Code implements ValueObject<Code, string> {
	constructor(private readonly _value: string) {
		if (_value.length > 100 || _value.length < 6)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message:
					'A quantidade de caracteres do código deve ser menor que 100 e maior que 6',
			});
	}

	public equalTo(input: Code) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
