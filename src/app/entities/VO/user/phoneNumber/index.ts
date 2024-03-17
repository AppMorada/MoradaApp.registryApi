import { EntitieError } from '@app/errors/entities';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { userDTORules } from '@app/entities/user';

export class PhoneNumber implements ValueObject<PhoneNumber, string> {
	constructor(private readonly _value: string) {
		this._value = this._value.replace(/[+ )(-]/g, '');

		if (
			this._value.length > userDTORules.phoneNumber.maxLength ||
			this._value.length < userDTORules.phoneNumber.minLength ||
			isNaN(Number(this._value))
		)
			throw new EntitieError({
				entity: EntitiesEnum.vo,
				message: `A quantidade de caracteres do número de telefone deve ser menor que ${userDTORules.phoneNumber.maxLength} e maior que ${userDTORules.phoneNumber.minLength}`,
			});
	}

	static toInt(input: PhoneNumber) {
		return parseInt(input.value);
	}

	static toString(input: number): string {
		const raw = String(input);
		if (raw.length < userDTORules.phoneNumber.minLength) {
			const newPaddingValue =
				userDTORules.phoneNumber.minLength - raw.length;
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
