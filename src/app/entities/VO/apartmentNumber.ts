import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '../entities';

export class ApartmentNumber {
	constructor(private readonly _value: number) {
		if (_value > 2147483647 || _value < 0)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of number in ApartmentNumber value.',
			});
	}

	public equalTo(input: ApartmentNumber) {
		return input.value === this._value;
	}

	get value(): number {
		return this._value;
	}
}
