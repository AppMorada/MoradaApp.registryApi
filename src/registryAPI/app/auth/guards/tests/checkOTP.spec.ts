import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryOTP } from '@registry:tests/inMemoryDatabase/otp';
import { InMemoryUser } from '@registry:tests/inMemoryDatabase/user';
import { CheckOTPGuard } from '../checkOTP.guard';
import { userFactory } from '@registry:tests/factories/user';
import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';
import { otpFactory } from '@registry:tests/factories/otp';
import { createMockExecutionContext } from '@registry:tests/guards/executionContextSpy';
import { CryptSpy } from '@registry:tests/adapters/cryptSpy';
import { GuardErrors } from '@registry:app/errors/guard';

describe('Check OTP Guard test', () => {
	let container: InMemoryContainer;
	let otpRepo: InMemoryOTP;
	let userRepo: InMemoryUser;

	let crypt: CryptSpy;

	let checkOTPGuard: CheckOTPGuard;

	beforeEach(() => {
		container = new InMemoryContainer();
		otpRepo = new InMemoryOTP(container);
		userRepo = new InMemoryUser(container);

		crypt = new CryptSpy();

		checkOTPGuard = new CheckOTPGuard(otpRepo, userRepo, crypt);
	});

	it('should be able to validate Check OTP Guard', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		await userRepo.create({ user, condominiumRelUser });

		const otp = otpFactory({ userId: user.id.value });
		await otpRepo.create({ otp, email: user.email });

		const context = createMockExecutionContext({
			body: {
				email: user.email.value,
				OTP: otp.code.value,
			},
		});

		await expect(checkOTPGuard.canActivate(context)).resolves.toBeTruthy();

		expect(crypt.calls.compare).toEqual(1);
		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);

		expect(otpRepo.calls.create).toEqual(1);
		expect(otpRepo.calls.find).toEqual(1);

		expect(otpRepo.calls.delete).toEqual(1);
	});

	it('should throw one error - User doesn\'t exist', async () => {
		const user = userFactory();
		const otp = otpFactory({ userId: user.id.value });

		const context = createMockExecutionContext({
			body: {
				email: user.email.value,
				OTP: otp.code.value,
			},
		});

		await expect(checkOTPGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'Usuário não existe',
			}),
		);

		expect(crypt.calls.compare).toEqual(0);
		expect(userRepo.calls.create).toEqual(0);
		expect(userRepo.calls.find).toEqual(1);

		expect(otpRepo.calls.create).toEqual(0);
		expect(otpRepo.calls.find).toEqual(0);

		expect(otpRepo.calls.delete).toEqual(0);
	});

	it('should throw one error - OTP doesn\'t exist', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		await userRepo.create({ user, condominiumRelUser });

		const otp = otpFactory({ userId: user.id.value });
		const context = createMockExecutionContext({
			body: {
				email: user.email.value,
				OTP: otp.code.value,
			},
		});

		await expect(checkOTPGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'OTP não existe',
			}),
		);

		expect(crypt.calls.compare).toEqual(0);
		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);

		expect(otpRepo.calls.create).toEqual(0);
		expect(otpRepo.calls.find).toEqual(1);

		expect(otpRepo.calls.delete).toEqual(0);
	});

	it('should throw one error - Invalid OTP', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		await userRepo.create({ user, condominiumRelUser });

		const otp = otpFactory({ userId: user.id.value });
		await otpRepo.create({ otp, email: user.email });

		const context = createMockExecutionContext({
			body: {
				email: user.email.value,
				OTP: '______',
			},
		});

		await expect(checkOTPGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'OTP inválido',
			}),
		);

		expect(crypt.calls.compare).toEqual(1);
		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);

		expect(otpRepo.calls.create).toEqual(1);
		expect(otpRepo.calls.find).toEqual(1);

		expect(otpRepo.calls.delete).toEqual(0);
	});
});
