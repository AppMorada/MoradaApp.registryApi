import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { userFactory } from '@tests/factories/user';
import { DeleteUserService } from '../../user/delete.service';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Delete user test', () => {
	let sut: DeleteUserService;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);
		sut = new DeleteUserService(userRepo);
	});

	it('should be able to delete a user', async () => {
		const user = userFactory();

		userRepo.users.push(user);
		await sut.exec({ id: user.id.value });

		expect(Boolean(userRepo.users[0])).toBeFalsy();
		expect(userRepo.calls.delete).toEqual(1);
	});
});
