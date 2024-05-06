import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumUpdate } from '@tests/inMemoryDatabase/condominium/write/update';
import { UpdateCondominiumService } from '@app/services/condominium/update.service';

describe('Update condominium service test', () => {
	let sut: UpdateCondominiumService;
	let updateCondominiumRepo: InMemoryCondominiumUpdate;

	beforeEach(() => {
		updateCondominiumRepo = new InMemoryCondominiumUpdate();
		sut = new UpdateCondominiumService(updateCondominiumRepo);
	});

	it('should be able to update a condominium', async () => {
		const condominium = condominiumFactory();
		await sut.exec({
			CEP: condominium.CEP.value,
			name: condominium.name.value,
			id: condominium.id.value,
			num: condominium.num.value,
		});

		expect(updateCondominiumRepo.calls.exec).toEqual(1);
	});
});
