import { OTP } from '@registry:app/entities/OTP';
import { EntitiesEnum } from '@registry:app/entities/entities';
import {
	ICreateOTPInput,
	IDeleteOTPInput,
	IFindOTPInput,
	OTPRepo,
} from '@registry:app/repositories/otp';
import { InMemoryError } from '@registry:tests/errors/inMemoryError';
import { InMemoryContainer } from '../inMemoryContainer';

export class InMemoryOTP implements OTPRepo {
	public calls = {
		create: 0,
		find: 0,
		delete: 0,
	};
	public otps: Array<{ key: string; value: OTP }>;

	constructor(container: InMemoryContainer) {
		this.otps = container.props.otpArr;
	}

	public async create(input: ICreateOTPInput): Promise<void> {
		++this.calls.create;

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
		++this.calls.find;

		const existentData = this.otps.find(
			(item) => `mockOTP:${input.email.value}` === item.key,
		);

		return existentData?.value;
	}

	public async delete(input: IDeleteOTPInput): Promise<void> {
		++this.calls.delete;

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
