import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { userRules } from '@app/entities/_rules/user';

export class Password implements ValueObject<Password, string> {
	constructor(private readonly _value: string) {
		if (
			_value.length > userRules.password.maxLength ||
			_value.length < userRules.password.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `A quantidade de caracteres da senha deve ser menor que ${userRules.password.maxLength} e maior que ${userRules.password.minLength}`,
			});
	}

	public equalTo(input: Password) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
