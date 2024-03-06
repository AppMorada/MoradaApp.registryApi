import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '@tests/inMemoryDatabase/condominium';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { DeleteCondominiumService } from '@app/services/condominium/delete.service';

describe('Delete condominium service test', () => {
	let sut: DeleteCondominiumService;

	let inMemoryContainer: InMemoryContainer;
	let condominiumRepo: InMemoryCondominium;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRepo = new InMemoryCondominium(inMemoryContainer);

		sut = new DeleteCondominiumService(condominiumRepo);
	});

	it('should be able to delete a condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });

		await condominiumRepo.create({ user, condominium });
		await sut.exec({
			id: condominium.id,
		});

		expect(condominiumRepo.calls.remove).toEqual(1);
	});
});
