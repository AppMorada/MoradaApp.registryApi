import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRelUserDTORules } from '@app/entities/condominiumRelUser';

export class ApartmentNumber implements ValueObject<ApartmentNumber, number> {
	constructor(private readonly _value: number) {
		if (
			_value > condominiumRelUserDTORules.apartmentNumber.maxLength ||
			_value < condominiumRelUserDTORules.apartmentNumber.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `O número do apartamento deve ser menor que ${condominiumRelUserDTORules.apartmentNumber.maxLength} e maior que ${condominiumRelUserDTORules.apartmentNumber.minLength}`,
			});
	}

	public equalTo(input: ApartmentNumber) {
		return input.value === this._value;
	}

	get value(): number {
		return this._value;
	}
}
