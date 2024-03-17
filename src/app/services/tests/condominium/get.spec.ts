import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '@tests/inMemoryDatabase/condominium';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { GetCondominiumService } from '@app/services/condominium/get.service';
import { CondominiumMapper } from '@app/mapper/condominium';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Get condominium service test', () => {
	let sut: GetCondominiumService;

	let inMemoryContainer: InMemoryContainer;
	let condominiumRepo: InMemoryCondominium;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRepo = new InMemoryCondominium(inMemoryContainer);

		sut = new GetCondominiumService(condominiumRepo);
	});

	it('should be able to get a condominium', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const condominium = condominiumFactory({ ownerId: user.id.value });

		await condominiumRepo.create({ user, condominium, uniqueRegistry });
		const { data: searchedCondominium } = await sut.exec({
			id: condominium.id,
		});

		expect(Boolean(searchedCondominium)).toEqual(true);

		const parsedCondominium = CondominiumMapper.toClass({
			...searchedCondominium!,
			seedKey: condominium.seedKey,
		});
		expect(parsedCondominium.equalTo(condominium)).toEqual(true);
		expect(condominiumRepo.calls.find).toEqual(1);
	});
});
