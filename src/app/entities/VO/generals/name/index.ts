import { EntitieError } from '@app/errors/entities';
import { ValueObject, EntitiesEnum } from '@app/entities/entities';
import { globalRules } from '@app/entities/_rules/global';

export class Name implements ValueObject<Name, string> {
	constructor(private readonly _value: string) {
		if (
			_value.length > globalRules.name.maxLength ||
			_value.length < globalRules.name.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `A quantidade de caracteres do nome deve ser menor que ${globalRules.name.maxLength} e maior que ${globalRules.name.minLength}`,
			});
	}

	public equalTo(input: Name) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
