import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { userFactory } from '@tests/factories/user';
import { DeleteUserService } from './deleteUser.service';

describe('Delete user test', () => {
	let deleteUser: DeleteUserService;
	let userRepo: InMemoryUser;

	beforeEach(() => {
		userRepo = new InMemoryUser();
		deleteUser = new DeleteUserService(userRepo);
	});

	it('should be able to delete a user', async () => {
		const user = userFactory();

		await userRepo.create({ user });
		await deleteUser.exec({ parameter: user.email });

		await userRepo.create({ user });
		await deleteUser.exec({ parameter: user.id });

		expect(Boolean(userRepo.users[0])).toBeFalsy();
	});
});
