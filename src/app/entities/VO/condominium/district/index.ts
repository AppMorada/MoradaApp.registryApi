import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRules } from '@app/entities/_rules/condominium';

export class District implements ValueObject<District, string> {
	constructor(private readonly _value: string) {
		if (
			this._value.length < condominiumRules.district.minLength ||
			this._value.length > condominiumRules.district.maxLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto do bairro',
			});
	}

	public equalTo(input: District) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
