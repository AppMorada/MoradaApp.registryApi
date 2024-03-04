import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '@tests/inMemoryDatabase/condominium';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { UpdateCondominiumService } from '@app/services/condominium/update.service';

describe('Update condominium service test', () => {
	let sut: UpdateCondominiumService;

	let inMemoryContainer: InMemoryContainer;
	let condominiumRepo: InMemoryCondominium;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRepo = new InMemoryCondominium(inMemoryContainer);

		sut = new UpdateCondominiumService(condominiumRepo);
	});

	it('should be able to update a condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });

		await condominiumRepo.create({ user, condominium });
		await sut.exec({
			CEP: condominium.CEP.value,
			name: condominium.name.value,
			id: condominium.id.value,
			num: condominium.num.value,
		});

		expect(condominiumRepo.calls.update).toEqual(1);
	});
});
