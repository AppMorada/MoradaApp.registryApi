import { userFactory } from '@tests/factories/user';
import { DeleteUserService } from '../../user/delete.service';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { InMemoryUserDelete } from '@tests/inMemoryDatabase/user/write/delete';

describe('Delete user test', () => {
	let sut: DeleteUserService;

	let deleteUserRepo: InMemoryUserDelete;

	beforeEach(() => {
		deleteUserRepo = new InMemoryUserDelete();
		sut = new DeleteUserService(deleteUserRepo);
	});

	it('should be able to delete a user', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });

		await sut.exec({ id: user.id.value });

		expect(deleteUserRepo.calls.exec).toEqual(1);
	});
});
