import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '../entities';

export class Level {
	constructor(private readonly _value: number) {
		if (_value > 2 || _value < 0)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of number in Level value.',
			});
	}

	public equalTo(input: Level) {
		return input.value() === this._value;
	}

	public value(): number {
		return this._value;
	}
}
