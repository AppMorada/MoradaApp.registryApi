import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRelUserRules } from '@app/entities/_rules/condominiumRelUser';

export class ApartmentNumber implements ValueObject<ApartmentNumber, number> {
	constructor(private readonly _value: number) {
		if (
			_value > condominiumRelUserRules.apartmentNumber.maxLength ||
			_value < condominiumRelUserRules.apartmentNumber.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `O número do apartamento deve ser menor que ${condominiumRelUserRules.apartmentNumber.maxLength} e maior que ${condominiumRelUserRules.apartmentNumber.minLength}`,
			});
	}

	public equalTo(input: ApartmentNumber) {
		return input.value === this._value;
	}

	get value(): number {
		return this._value;
	}
}
