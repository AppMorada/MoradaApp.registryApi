import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRules } from '@app/entities/_rules/condominium';

export class Complement implements ValueObject<Complement, string> {
	constructor(private readonly _value: string) {
		if (
			this._value.length < condominiumRules.complement.minLength ||
			this._value.length > condominiumRules.complement.maxLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de complemento',
			});
	}

	public equalTo(input: Complement) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
