import { InMemoryUserWriteOps } from '@tests/inMemoryDatabase/user/write';
import { userFactory } from '@tests/factories/user';
import { DeleteUserService } from '../../user/delete.service';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Delete user test', () => {
	let sut: DeleteUserService;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUserWriteOps;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUserWriteOps(inMemoryContainer);
		sut = new DeleteUserService(userRepo);
	});

	it('should be able to delete a user', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });

		userRepo.uniqueRegistries.push(uniqueRegistry);
		userRepo.users.push(user);

		await sut.exec({ id: user.id.value });

		expect(Boolean(userRepo.users[0])).toBeFalsy();
		expect(userRepo.calls.delete).toEqual(1);
	});
});
