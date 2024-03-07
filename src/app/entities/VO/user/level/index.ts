import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRelUserDTORules } from '@app/entities/condominiumRelUser';

export class Level implements ValueObject<Level, number> {
	constructor(private readonly _value: number) {
		if (
			_value > condominiumRelUserDTORules.level.maxLength ||
			_value < condominiumRelUserDTORules.level.minLength
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message:
					'O nível hierarquico do usuário não esta nos valores aceitos',
			});
	}

	public equalTo(input: Level) {
		return input.value === this._value;
	}

	get value(): number {
		return this._value;
	}
}
