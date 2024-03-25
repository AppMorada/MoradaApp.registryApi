import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRelUserRules } from '@app/entities/_rules/condominiumRelUser';

export class Level implements ValueObject<Level, number> {
	constructor(private readonly _value: number) {
		if (
			_value > condominiumRelUserRules.level.maxLength ||
			_value < condominiumRelUserRules.level.minLength
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
