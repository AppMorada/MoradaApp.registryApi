import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumWriteOps } from '@tests/inMemoryDatabase/condominium/write';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { UpdateCondominiumService } from '@app/services/condominium/update.service';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

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
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const condominium = condominiumFactory({ ownerId: user.id.value });

		await condominiumRepo.create({ user, condominium, uniqueRegistry });
		await sut.exec({
			CEP: condominium.CEP.value,
			name: condominium.name.value,
			id: condominium.id.value,
			num: condominium.num.value,
		});

		expect(condominiumRepo.calls.update).toEqual(1);
	});
});
