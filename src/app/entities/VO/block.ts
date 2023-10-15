import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum } from '../entities';

export class Block {
	constructor(private readonly _value: string) {
		if (_value.length > 6)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Incorrect range of length in Block value.',
			});
	}

	public equalTo(input: Block) {
		return input.value() === this._value;
	}

	public value(): string {
		return this._value;
	}
}
