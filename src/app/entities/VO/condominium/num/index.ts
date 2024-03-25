import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRules } from '@app/entities/_rules/condominium';

export class Num implements ValueObject<Num, number> {
	constructor(private readonly _value: number) {
		if (
			_value > condominiumRules.num.maxLength ||
			_value < condominiumRules.num.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `O número da rua do condomínio deve ser menor que ${condominiumRules.num.maxLength} e maior que ${condominiumRules.num.minLength}`,
			});
	}

	public equalTo(input: Num) {
		return input.value === this._value;
	}

	get value(): number {
		return this._value;
	}
}
