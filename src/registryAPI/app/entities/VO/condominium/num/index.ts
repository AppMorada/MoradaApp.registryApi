import { EntitieError } from '@registry:app/errors/entities';
import { EntitiesEnum, ValueObject } from '@registry:app/entities/entities';
import { condominiumDTORules } from '@registry:app/entities/condominium';

export class Num implements ValueObject<Num, number> {
	/**
	 * Número da rua onde se encontra o condomínio
	 * @param _value - O número em questão
	 **/
	constructor(private readonly _value: number) {
		if (
			_value > condominiumDTORules.num.maxLength ||
			_value < condominiumDTORules.num.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto Num',
			});
	}

	public equalTo(input: Num) {
		return input.value === this._value;
	}

	get value(): number {
		return this._value;
	}
}
