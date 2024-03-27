import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumReadOps } from '@tests/inMemoryDatabase/condominium/read';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { GetCondominiumService } from '@app/services/condominium/get.service';
import { CondominiumMapper } from '@app/mapper/condominium';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { InMemoryCondominiumWriteOps } from '@tests/inMemoryDatabase/condominium/write';

describe('Get condominium service test', () => {
	let sut: GetCondominiumService;

	let inMemoryContainer: InMemoryContainer;
	let condominiumRepoReadOps: InMemoryCondominiumReadOps;
	let condominiumRepoWriteOps: InMemoryCondominiumWriteOps;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRepoReadOps = new InMemoryCondominiumReadOps(
			inMemoryContainer,
		);
		condominiumRepoWriteOps = new InMemoryCondominiumWriteOps(
			inMemoryContainer,
		);

		sut = new GetCondominiumService(condominiumRepoReadOps);
	});

	it('should be able to get a condominium', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const condominium = condominiumFactory({ ownerId: user.id.value });

		await condominiumRepoWriteOps.create({
			user,
			condominium,
			uniqueRegistry,
		});
		const { data: searchedCondominium } = await sut.exec({
			id: condominium.id,
		});

		expect(Boolean(searchedCondominium)).toEqual(true);

		const parsedCondominium = CondominiumMapper.toClass({
			...searchedCondominium!,
			seedKey: condominium.seedKey,
		});
		expect(parsedCondominium.equalTo(condominium)).toEqual(true);
		expect(condominiumRepoReadOps.calls.find).toEqual(1);
	});
});
