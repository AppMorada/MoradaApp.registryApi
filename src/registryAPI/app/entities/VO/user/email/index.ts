import { EntitieError } from '@registry:app/errors/entities';
import { EntitiesEnum, ValueObject } from '@registry:app/entities/entities';
import { userDTORules } from '@registry:app/entities/user';

export class Email implements ValueObject<Email, string> {
	/**
	 * @param _value - Email que deve conter menos de 320 caracteres
	 **/
	constructor(private readonly _value: string) {
		if (_value.length > userDTORules.email.maxLength)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de email',
			});
	}

	public equalTo(input: Email) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
