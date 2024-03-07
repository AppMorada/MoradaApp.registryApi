import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumDTORules } from '@app/entities/condominium';

export class Num implements ValueObject<Num, number> {
	constructor(private readonly _value: number) {
		if (
			_value > condominiumDTORules.num.maxLength ||
			_value < condominiumDTORules.num.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `O número da rua do condomínio deve ser menor que ${condominiumDTORules.num.maxLength} e maior que ${condominiumDTORules.num.minLength}`,
			});
	}

	public equalTo(input: Num) {
		return input.value === this._value;
	}

	get value(): number {
		return this._value;
	}
}
