import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { condominiumRules } from '@app/entities/_rules/condominium';

export class CNPJ implements ValueObject<CNPJ, string> {
	constructor(private readonly _value: string) {
		this._value = this._value.replaceAll(/[./-]/g, '');

		if (
			this._value.length !== condominiumRules.CNPJ.minLength ||
			isNaN(Number(this._value))
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de CNPJ',
			});

		const validators = this._value.slice(
			this._value.length - 2,
			this._value.length,
		);
		const body = this._value.slice(0, -2);
		const firstDigitMultipliers = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
		this.validateDigit(
			body,
			parseInt(validators[0]),
			firstDigitMultipliers,
		);

		const secondDigitMultipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
		this.validateDigit(
			body + validators[0],
			parseInt(validators[1]),
			secondDigitMultipliers,
		);
	}

	private validateDigit(
		body: string,
		validatorNumber: number,
		multipliers: number[],
	) {
		if (multipliers.length !== body.length)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: 'Valor incorreto de CNPJ',
			});

		const totals: number[] = [];
		for (let i = 0; i < body.length; i++)
			totals.push(parseInt(body[i]) * multipliers[i]);

		const total = totals.reduce((prev, current) => prev + current);
		const rest = Math.floor(total / 11);

		const result = total - 11 * rest;

		if ((result === 0 || result === 1) && validatorNumber === 0) return;

		if (result > 1 && result <= 10 && validatorNumber === 11 - result)
			return;

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
		if (raw.length < condominiumRules.CNPJ.minLength) {
			const newPaddingValue =
				condominiumRules.CNPJ.minLength - raw.length;
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
