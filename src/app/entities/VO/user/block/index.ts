import { EntitieError } from '@app/errors/entities';
import { ValueObject, EntitiesEnum } from '@app/entities/entities';
import { condominiumRelUserRules } from '@app/entities/_rules/condominiumRelUser';

export class Block implements ValueObject<Block, string> {
	constructor(private readonly _value: string) {
		if (_value.length > condominiumRelUserRules.block.maxLength)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `O número de caracteres do bloco do apartamento deve ser menor que ${condominiumRelUserRules.block.maxLength}`,
			});
	}

	public equalTo(input: Block) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
