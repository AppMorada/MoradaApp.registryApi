import { OTP } from '@app/entities/OTP';
import { EntitiesEnum } from '@app/entities/entities';
import {
	ICreateOTPInput,
	IDeleteOTPInput,
	IFindOTPInput,
	OTPRepo,
} from '@app/repositories/otp';
import { InMemoryError } from '@tests/errors/inMemoryError';

export class InMemoryOTP implements OTPRepo {
	public calls = {
		create: 0,
		find: 0,
		delete: 0,
	};
	public otps: Array<{ key: string; value: OTP }> = [];

	public async create(input: ICreateOTPInput): Promise<void> {
		this.calls.create = this.calls.create + 1;

		const existentData = this.otps.find(
			(item) => `mockOTP:${input.email.value}` === item.key,
		);

		if (existentData)
			throw new InMemoryError({
				entity: EntitiesEnum.otp,
				message: 'OTP already exist',
			});

		this.otps.push({
			key: `mockOTP:${input.email.value}`,
			value: input.otp,
		});
	}

	public async find(input: IFindOTPInput): Promise<OTP | undefined> {
		this.calls.find = this.calls.find + 1;

		const existentData = this.otps.find(
			(item) => `mockOTP:${input.email.value}` === item.key,
		);

		return existentData?.value;
	}

	public async delete(input: IDeleteOTPInput): Promise<void> {
		this.calls.delete = this.calls.delete + 1;

		const existentDataIndex = this.otps.findIndex(
			(item) => `mockOTP:${input.email.value}` === item.key,
		);

		if (existentDataIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.otp,
				message: 'OTP doesn\'t exist',
			});

		this.otps.splice(existentDataIndex, 1);
	}
}
