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
	public otps: OTP[] = [];

	public async create(input: ICreateOTPInput): Promise<void> {
		const existentData = this.otps.find(
			(item) =>
				input.otp.id === item.id || input.otp.userId === item.userId,
		);

		if (existentData)
			throw new InMemoryError({
				entity: EntitiesEnum.otp,
				message: 'OTP already exist',
			});

		this.otps.push(input.otp);
	}

	public async find(input: IFindOTPInput): Promise<OTP | undefined> {
		const existentData = this.otps.find((item) => {
			return input.userId && item.userId;
		});

		return existentData;
	}

	public async delete(input: IDeleteOTPInput): Promise<void> {
		const existentDataIndex = this.otps.findIndex((item) => {
			return input.userId && item.userId;
		});

		if (existentDataIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.otp,
				message: 'OTP doesn\'t exist',
			});

		this.otps.splice(existentDataIndex, 1);
	}
}
