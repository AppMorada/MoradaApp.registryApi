import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryOTP } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { otpFactory } from '@tests/factories/otp';

describe('InMemoryData test: OTP', () => {
	let sut: InMemoryOTP;

	beforeEach(() => (sut = new InMemoryOTP()));

	it('should be able to create one OTP', async () => {
		const otp = otpFactory();
		expect(sut.create({ otp })).resolves;
	});

	it('should be able to delete one OTP', async () => {
		const otp = otpFactory();

		await sut.create({ otp });
		await sut.delete({ userId: otp.userId });

		expect(Boolean(sut.otps[0])).toBeFalsy();
	});

	it('should be able to throw one error: OTP does not exist - delete operation', async () => {
		const otp = otpFactory();
		await expect(sut.delete({ userId: otp.userId })).rejects.toThrowError(
			new InMemoryError({
				entity: EntitiesEnum.otp,
				message: 'OTP doesn\'t exist',
			}),
		);
	});

	it('should be able to throw one error: OTP already exist', async () => {
		const otp = otpFactory();
		expect(sut.create({ otp })).resolves;
		await expect(sut.create({ otp })).rejects.toThrowError(
			new InMemoryError({
				entity: EntitiesEnum.otp,
				message: 'OTP already exist',
			}),
		);
	});

	it('should be able to find one OTP', async () => {
		const otp = otpFactory();
		sut.otps.push(otp);

		const sut2 = await sut.find({
			userId: otp.userId,
		});

		expect(Boolean(sut2)).toBeTruthy();
	});
});
