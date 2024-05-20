import { userFactory } from '@tests/factories/user';
import { DeleteUserService } from '../../user/delete.service';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { InMemoryUserDelete } from '@tests/inMemoryDatabase/user/write/delete';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('Delete user test', () => {
	let sut: DeleteUserService;

	let deleteUserRepo: InMemoryUserDelete;
	let eventEmitter: EventEmitter2;

	beforeEach(() => {
		deleteUserRepo = new InMemoryUserDelete();
		eventEmitter = new EventEmitter2();
		sut = new DeleteUserService(deleteUserRepo, eventEmitter);
	});

	it('should be able to delete a user', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		EventEmitter2.prototype.emit = jest.fn(() => true);

		await sut.exec({ user, uniqueRegistry });

		expect(deleteUserRepo.calls.exec).toEqual(1);
	});
});
