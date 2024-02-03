import { EntitieError } from '@registry:app/errors/entities';
import { ValueObject, EntitiesEnum } from '@registry:app/entities/entities';
import { userDTORules } from '@registry:app/entities/user';

/** Nome utilizado nas entidades */
export class Name implements ValueObject<Name, string> {
	constructor(private readonly _value: string) {
		if (
			_value.length > userDTORules.name.maxLength ||
			_value.length < userDTORules.name.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `A quantidade de caracteres do nome deve ser menor que ${userDTORules.name.maxLength} e maior que ${userDTORules.name.minLength}`,
			});
	}

	public equalTo(input: Name) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
