import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { userRules } from '@app/entities/_rules/user';

export class PhoneNumber implements ValueObject<PhoneNumber, string> {
	constructor(private readonly _value: string) {
		this._value = this._value.replace(/[+ )(-]/g, '');

		if (
			this._value.length > userRules.phoneNumber.maxLength ||
			this._value.length < userRules.phoneNumber.minLength ||
			isNaN(Number(this._value))
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `A quantidade de caracteres do número de telefone deve ser menor que ${userRules.phoneNumber.maxLength} e maior que ${userRules.phoneNumber.minLength}`,
			});
	}

	static toInt(input: PhoneNumber) {
		return parseInt(input.value);
	}

	static toString(input: number): string {
		const raw = String(input);
		if (raw.length < userRules.phoneNumber.minLength) {
			const newPaddingValue =
				userRules.phoneNumber.minLength - raw.length;
			return raw.padStart(
				raw.length + newPaddingValue,
				'0'.repeat(newPaddingValue),
			);
		}

		return raw;
	}

	public equalTo(input: PhoneNumber) {
		return input.value === this._value;
	}

	get value(): string {
		return this._value;
	}
}
