import { EntitieError } from '@registry:app/errors/entities';
import { EntitiesEnum, ValueObject } from '@registry:app/entities/entities';
import { condominiumRelUserDTORules } from '@registry:app/entities/condominiumRelUser';

export class Level implements ValueObject<Level, number> {
	/**
	 * @param _value - O nível do usuário, que deve ser 0 (usuário comum), 1 (funcionário) ou 2 (administrador)
	 **/
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
