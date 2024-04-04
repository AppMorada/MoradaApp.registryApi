import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRules } from '@app/entities/_rules/condominium';

export class Reference implements ValueObject<Reference, string> {
	constructor(private readonly _value: string) {
		if (
			this._value.length < condominiumRules.reference.minLength ||
			this._value.length > condominiumRules.reference.maxLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto da referência',
			});
	}

	public equalTo(input: Reference) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
