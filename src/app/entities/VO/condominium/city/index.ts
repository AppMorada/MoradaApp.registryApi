import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRules } from '@app/entities/_rules/condominium';

export class City implements ValueObject<City, string> {
	constructor(private readonly _value: string) {
		if (
			this._value.length < condominiumRules.city.minLength ||
			this._value.length > condominiumRules.city.maxLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto da cidade',
			});
	}

	public equalTo(input: City) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
