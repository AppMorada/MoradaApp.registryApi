import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { userDTORules } from '@app/entities/user';

export class Email implements ValueObject<Email, string> {
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
