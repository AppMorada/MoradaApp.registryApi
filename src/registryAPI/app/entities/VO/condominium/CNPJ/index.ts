import { EntitieError } from '@registry:app/errors/entities';
import { EntitiesEnum, ValueObject } from '@registry:app/entities/entities';
import { condominiumDTORules } from '@registry:app/entities/condominium';

export class CNPJ implements ValueObject<CNPJ, string> {
	/**
	 * Deve conter valores validos de um CNPJ, formatados ou não
	 * @param _value - CNPJ em questão
	 **/
	constructor(private readonly _value: string) {
		this._value = _value.replaceAll(/[./-]/g, '');

		if (this._value.length !== condominiumDTORules.CNPJ.minLength)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de CNPJ',
			});
	}

	public equalTo(input: CNPJ) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
