import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '@tests/inMemoryDatabase/condominium';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { CondominiumMapper } from '@app/mapper/condominium';
import { GetCondominiumByOwnerIdService } from '@app/services/condominium/getByOwnerId.service';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Get condominium by owner id service test', () => {
	let sut: GetCondominiumByOwnerIdService;

	let inMemoryContainer: InMemoryContainer;
	let condominiumRepo: InMemoryCondominium;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRepo = new InMemoryCondominium(inMemoryContainer);

		sut = new GetCondominiumByOwnerIdService(condominiumRepo);
	});

	it('should be able to get a condominium', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const condominium = condominiumFactory({ ownerId: user.id.value });

		await condominiumRepo.create({ user, condominium, uniqueRegistry });
		const { condominiums } = await sut.exec({ id: user.id });

		expect(Boolean(condominiums[0])).toEqual(true);

		const parsedCondominium = CondominiumMapper.toClass(condominiums[0]!);
		expect(parsedCondominium.equalTo(condominium)).toEqual(true);
		expect(condominiumRepo.calls.getCondominiumsByOwnerId).toEqual(1);
	});
});
