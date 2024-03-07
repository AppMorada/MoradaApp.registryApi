import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { userDTORules } from '@app/entities/user';

export class Password implements ValueObject<Password, string> {
	constructor(private readonly _value: string) {
		if (
			_value.length > userDTORules.password.maxLength ||
			_value.length < userDTORules.password.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `A quantidade de caracteres da senha deve ser menor que ${userDTORules.password.maxLength} e maior que ${userDTORules.password.minLength}`,
			});
	}

	public equalTo(input: Password) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
