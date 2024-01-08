import { EntitieError } from '@registry:app/errors/entities';
import { EntitiesEnum, ValueObject } from '@registry:app/entities/entities';
import { condominiumDTORules } from '@registry:app/entities/condominium';

export class CEP implements ValueObject<CEP, string> {
	/**
	 * Deve conter valores validos de um CEP, formatados ou não
	 * @param _value - CEP em questão
	 **/
	constructor(private readonly _value: string) {
		this._value = _value.replace(/[-]/g, '');

		if (this._value.length !== condominiumDTORules.CEP.minLength)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de CEP',
			});
	}

	public equalTo(input: CEP) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
