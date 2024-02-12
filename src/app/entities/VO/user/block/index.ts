import { EntitieError } from '@app/errors/entities';
import { ValueObject, EntitiesEnum } from '@app/entities/entities';
import { condominiumRelUserDTORules } from '@app/entities/condominiumRelUser';

export class Block implements ValueObject<Block, string> {
	/**
	 * @param _value - Nome do block que deve estar entre 6 e 0 caracteres
	 **/
	constructor(private readonly _value: string) {
		if (_value.length > condominiumRelUserDTORules.block.maxLength)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `O número de caracteres do bloco do apartamento deve ser menor que ${condominiumRelUserDTORules.block.maxLength}`,
			});
	}

	public equalTo(input: Block) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
