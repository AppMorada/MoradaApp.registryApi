import { InMemoryError } from '@registry:tests/errors/inMemoryError';
import { InMemoryOTP } from '.';
import { EntitiesEnum } from '@registry:app/entities/entities';
import { otpFactory } from '@registry:tests/factories/otp';
import { userFactory } from '@registry:tests/factories/user';
import { InMemoryContainer } from '../inMemoryContainer';

describe('InMemoryData test: OTP', () => {
	let container: InMemoryContainer;
	let sut: InMemoryOTP;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryOTP(container);
	});

	it('should be able to create one OTP', async () => {
		const user = userFactory();
		const otp = otpFactory();
		expect(sut.create({ email: user.email, otp })).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to delete one OTP', async () => {
		const user = userFactory();
		const otp = otpFactory();

		await sut.create({ email: user.email, otp });
		await sut.delete({ email: user.email });

		expect(Boolean(sut.otps[0])).toBeFalsy();
		expect(sut.calls.create).toEqual(1);
		expect(sut.calls.delete).toEqual(1);
	});

	it('should be able to throw one error: OTP does not exist - delete operation', async () => {
		const user = userFactory();
		await expect(sut.delete({ email: user.email })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.otp,
				message: 'OTP doesn\'t exist',
			}),
		);
		expect(sut.calls.delete).toEqual(1);
	});

	it('should be able to throw one error: OTP already exist', async () => {
		const user = userFactory();
		const otp = otpFactory();
		expect(sut.create({ otp, email: user.email })).resolves;
		await expect(sut.create({ otp, email: user.email })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.otp,
				message: 'OTP already exist',
			}),
		);
		expect(sut.calls.create).toEqual(2);
	});

	it('should be able to find one OTP', async () => {
		const user = userFactory();
		const otp = otpFactory();
		sut.otps.push({ key: `mockOTP:${user.email.value}`, value: otp });

		const sut2 = await sut.find({
			email: user.email,
		});

		expect(Boolean(sut2)).toBeTruthy();
		expect(sut.calls.find).toEqual(1);
	});
});
