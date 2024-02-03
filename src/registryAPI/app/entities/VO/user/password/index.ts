import { EntitieError } from '@registry:app/errors/entities';
import { EntitiesEnum, ValueObject } from '@registry:app/entities/entities';
import { userDTORules } from '@registry:app/entities/user';

export class Password implements ValueObject<Password, string> {
	/**
	 * @param _value - Senha do usuário que deve estar entre 64 e 8 caracteres
	 **/
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
