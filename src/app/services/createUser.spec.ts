import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { CreateUserService } from './createUser.service';
import { userFactory } from '@tests/factories/user';

describe('Create user test', () => {
	let createUser: CreateUserService;
	let userRepo: InMemoryUser;

	beforeEach(() => {
		userRepo = new InMemoryUser();
		createUser = new CreateUserService(userRepo);
	});

	it('should be able to create a user', async () => {
		const user = userFactory();

		await createUser.exec({ user });

		expect(userRepo.users[0].equalTo(user)).toBeTruthy();
	});
});
