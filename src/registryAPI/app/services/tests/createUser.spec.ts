import { InMemoryUser } from '@registry:tests/inMemoryDatabase/user';
import { CreateUserService } from '../createUser.service';
import { userFactory } from '@registry:tests/factories/user';
import { CryptSpy } from '@registry:tests/adapters/cryptSpy';
import { InMemoryOTP } from '@registry:tests/inMemoryDatabase/otp';
import { otpFactory } from '@registry:tests/factories/otp';

describe('Create user test', () => {
	let createUser: CreateUserService;
	let userRepo: InMemoryUser;
	let crypt: CryptSpy;
	let otpSpy: InMemoryOTP;

	beforeEach(() => {
		userRepo = new InMemoryUser();
		crypt = new CryptSpy();
		otpSpy = new InMemoryOTP();
		createUser = new CreateUserService(userRepo, crypt, otpSpy);
	});

	it('should be able to create a user', async () => {
		const user = userFactory();

		const otp = otpFactory();
		otpSpy.create({ email: user.email, otp });

		await createUser.exec({ user });

		expect(userRepo.users[0].equalTo(user)).toBeTruthy();
		expect(userRepo.calls.create).toEqual(1);
		expect(otpSpy.calls.create).toEqual(1);
	});
});
