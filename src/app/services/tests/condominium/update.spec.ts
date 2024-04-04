import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumWriteOps } from '@tests/inMemoryDatabase/condominium/write';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { UpdateCondominiumService } from '@app/services/condominium/update.service';

describe('Update condominium service test', () => {
	let sut: UpdateCondominiumService;

	let inMemoryContainer: InMemoryContainer;
	let condominiumRepo: InMemoryCondominiumWriteOps;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRepo = new InMemoryCondominiumWriteOps(inMemoryContainer);

		sut = new UpdateCondominiumService(condominiumRepo);
	});

	it('should be able to update a condominium', async () => {
		const condominium = condominiumFactory();

		await condominiumRepo.create({ condominium });
		await sut.exec({
			CEP: condominium.CEP.value,
			name: condominium.name.value,
			id: condominium.id.value,
			num: condominium.num.value,
		});

		expect(condominiumRepo.calls.update).toEqual(1);
	});
});
