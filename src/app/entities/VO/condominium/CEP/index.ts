import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRules } from '@app/entities/_rules/condominium';

export class CEP implements ValueObject<CEP, string> {
	constructor(private readonly _value: string) {
		this._value = this._value.replace(/[-]/g, '');

		if (
			this._value.length !== condominiumRules.CEP.minLength ||
			isNaN(Number(this._value))
		)
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
		if (raw.length < condominiumRules.CEP.minLength) {
			const newPaddingValue = condominiumRules.CEP.minLength - raw.length;
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
