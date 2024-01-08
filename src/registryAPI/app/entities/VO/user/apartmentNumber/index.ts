import { EntitieError } from '@registry:app/errors/entities';
import { EntitiesEnum, ValueObject } from '@registry:app/entities/entities';
import { condominiumRelUserDTORules } from '@registry:app/entities/condominiumRelUser';

export class ApartmentNumber implements ValueObject<ApartmentNumber, number> {
	/**
	 * @param _value - Número do apartamento que esta entre 2147483647 e 0
	 **/
	constructor(private readonly _value: number) {
		if (
			_value > condominiumRelUserDTORules.apartmentNumber.maxLength ||
			_value < condominiumRelUserDTORules.apartmentNumber.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de ApartmentNumber',
			});
	}

	public equalTo(input: ApartmentNumber) {
		return input.value === this._value;
	}

	get value(): number {
		return this._value;
	}
}
