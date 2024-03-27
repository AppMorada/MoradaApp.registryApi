import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumWriteOps } from '@tests/inMemoryDatabase/condominium/write';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { DeleteCondominiumService } from '@app/services/condominium/delete.service';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Delete condominium service test', () => {
	let sut: DeleteCondominiumService;

	let inMemoryContainer: InMemoryContainer;
	let condominiumRepo: InMemoryCondominiumWriteOps;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRepo = new InMemoryCondominiumWriteOps(inMemoryContainer);

		sut = new DeleteCondominiumService(condominiumRepo);
	});

	it('should be able to delete a condominium', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const condominium = condominiumFactory({ ownerId: user.id.value });

		await condominiumRepo.create({ user, condominium, uniqueRegistry });
		await sut.exec({
			id: condominium.id,
		});

		expect(condominiumRepo.calls.remove).toEqual(1);
	});
});
