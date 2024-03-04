import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumDTORules } from '@app/entities/condominium';

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

	static toInt(input: CEP) {
		return parseInt(input.value);
	}

	static toString(input: number): string {
		const raw = String(input);
		if (raw.length < condominiumDTORules.CEP.minLength) {
			const newPaddingValue =
				condominiumDTORules.CEP.minLength - raw.length;
			return raw.padStart(
				raw.length + newPaddingValue,
				'0'.repeat(newPaddingValue),
			);
		}

		return raw;
	}

	public equalTo(input: CEP) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
