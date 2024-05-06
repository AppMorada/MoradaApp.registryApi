import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumRemove } from '@tests/inMemoryDatabase/condominium/write/remove';
import { DeleteCondominiumService } from '@app/services/condominium/delete.service';

describe('Delete condominium service test', () => {
	let sut: DeleteCondominiumService;
	let removeCondominiumRepo: InMemoryCondominiumRemove;

	beforeEach(() => {
		removeCondominiumRepo = new InMemoryCondominiumRemove();
		sut = new DeleteCondominiumService(removeCondominiumRepo);
	});

	it('should be able to delete a condominium', async () => {
		const condominium = condominiumFactory();

		await sut.exec({
			id: condominium.id,
		});

		expect(removeCondominiumRepo.calls.exec).toEqual(1);
	});
});
