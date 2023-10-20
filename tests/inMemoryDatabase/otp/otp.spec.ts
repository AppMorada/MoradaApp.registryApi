import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryOTP } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { otpFactory } from '@tests/factories/otp';
import { userFactory } from '@tests/factories/user';

describe('InMemoryData test: OTP', () => {
	let sut: InMemoryOTP;

	beforeEach(() => (sut = new InMemoryOTP()));

	it('should be able to create one OTP', async () => {
		const user = userFactory();
		const otp = otpFactory();
		expect(sut.create({ email: user.email, otp })).resolves;
	});

	it('should be able to delete one OTP', async () => {
		const user = userFactory();
		const otp = otpFactory();

		await sut.create({ email: user.email, otp });
		await sut.delete({ email: user.email });

		expect(Boolean(sut.otps[0])).toBeFalsy();
	});

	it('should be able to throw one error: OTP does not exist - delete operation', async () => {
		const user = userFactory();
		await expect(sut.delete({ email: user.email })).rejects.toThrowError(
			new InMemoryError({
				entity: EntitiesEnum.otp,
				message: 'OTP doesn\'t exist',
			}),
		);
	});

	it('should be able to throw one error: OTP already exist', async () => {
		const user = userFactory();
		const otp = otpFactory();
		expect(sut.create({ otp, email: user.email })).resolves;
		await expect(
			sut.create({ otp, email: user.email }),
		).rejects.toThrowError(
			new InMemoryError({
				entity: EntitiesEnum.otp,
				message: 'OTP already exist',
			}),
		);
	});

	it('should be able to find one OTP', async () => {
		const user = userFactory();
		const otp = otpFactory();
		sut.otps.push({ key: `mockOTP:${user.email.value}`, value: otp });

		const sut2 = await sut.find({
			email: user.email,
		});

		expect(Boolean(sut2)).toBeTruthy();
	});
});
