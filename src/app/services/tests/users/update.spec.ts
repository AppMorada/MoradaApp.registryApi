import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { userFactory } from '@tests/factories/user';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { UpdateUserService } from '@app/services/user/update.service';

describe('Update user test', () => {
	let sut: UpdateUserService;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);
		sut = new UpdateUserService(userRepo);
	});

	it('should be able to update a user', async () => {
		const user = userFactory();

		userRepo.users.push(user);
		await sut.exec({ id: user.id.value, name: 'new name' });

		expect(userRepo.users[0].name.value === 'new name').toBe(true);
		expect(userRepo.calls.update).toEqual(1);
	});
});
