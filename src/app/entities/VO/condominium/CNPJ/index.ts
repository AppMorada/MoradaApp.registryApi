import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumDTORules } from '@app/entities/condominium';

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

	static toInt(input: CNPJ) {
		return parseInt(input.value);
	}

	static toString(input: number): string {
		const raw = String(input);
		if (raw.length < condominiumDTORules.CNPJ.minLength) {
			const newPaddingValue =
				condominiumDTORules.CNPJ.minLength - raw.length;
			return raw.padStart(
				raw.length + newPaddingValue,
				'0'.repeat(newPaddingValue),
			);
		}

		return raw;
	}

	public equalTo(input: CNPJ) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
