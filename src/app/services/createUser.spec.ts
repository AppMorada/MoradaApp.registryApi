import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { CreateUserService } from './createUser.service';
import { userFactory } from '@tests/factories/user';
import { CryptMock } from '@tests/adapters/cryptMock';

describe('Create user test', () => {
	let createUser: CreateUserService;
	let userRepo: InMemoryUser;
	let crypt: CryptMock;

	beforeEach(() => {
		userRepo = new InMemoryUser();
		crypt = new CryptMock();
		createUser = new CreateUserService(userRepo, crypt);
	});

	it('should be able to create a user', async () => {
		const user = userFactory();

		await createUser.exec({ user });

		expect(userRepo.users[0].equalTo(user)).toBeTruthy();
	});
});
