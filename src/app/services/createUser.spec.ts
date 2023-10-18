import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { CreateUserService } from './createUser.service';
import { userFactory } from '@tests/factories/user';
import { CryptMock } from '@tests/adapters/cryptMock';
import { InMemoryOTP } from '@tests/inMemoryDatabase/otp';
import { otpFactory } from '@tests/factories/otp';

describe('Create user test', () => {
	let createUser: CreateUserService;
	let userRepo: InMemoryUser;
	let crypt: CryptMock;
	let otpMock: InMemoryOTP;

	beforeEach(() => {
		userRepo = new InMemoryUser();
		crypt = new CryptMock();
		otpMock = new InMemoryOTP();
		createUser = new CreateUserService(userRepo, crypt, otpMock);
	});

	it('should be able to create a user', async () => {
		const user = userFactory();

		const otp = otpFactory();
		otpMock.create({ email: user.email, otp });

		await createUser.exec({ user });

		expect(userRepo.users[0].equalTo(user)).toBeTruthy();
	});
});
