import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { userDTORules } from '@app/entities/user';

export class PhoneNumber implements ValueObject<PhoneNumber, string> {
	/**
	 * @param _value - Número do telefone do usuário que deve estar entre 30 e 10 caracteres
	 **/
	constructor(private readonly _value: string) {
		if (
			_value.length > userDTORules.phoneNumber.maxLength ||
			_value.length < userDTORules.phoneNumber.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `A quantidade de caracteres do número de telefone deve ser menor que ${userDTORules.phoneNumber.maxLength} e maior que ${userDTORules.phoneNumber.minLength}`,
			});
	}

	public equalTo(input: PhoneNumber) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
