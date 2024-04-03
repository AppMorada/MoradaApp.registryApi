import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryCondominiumRequestWriteOps } from '@tests/inMemoryDatabase/condominiumRequest/write';
import { MakeCondominiumRequestService } from '@app/services/condominiumRequests/makeRequest';
import { InMemoryCondominiumReadOps } from '@tests/inMemoryDatabase/condominium/read';
import { InMemoryCondominiumWriteOps } from '@tests/inMemoryDatabase/condominium/write';
import { InMemoryUserWriteOps } from '@tests/inMemoryDatabase/user/write';
import { condominiumFactory } from '@tests/factories/condominium';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Create request test', () => {
	let sut: MakeCondominiumRequestService;
	let inMemoryContainer: InMemoryContainer;
	let condominiumRequestRepoWriteOps: InMemoryCondominiumRequestWriteOps;
	let condominiumRepoReadOps: InMemoryCondominiumReadOps;
	let condominiumRepoWriteOps: InMemoryCondominiumWriteOps;
	let userRepoWriteOps: InMemoryUserWriteOps;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRepoWriteOps = new InMemoryCondominiumWriteOps(
			inMemoryContainer,
		);
		userRepoWriteOps = new InMemoryUserWriteOps(inMemoryContainer);
		condominiumRequestRepoWriteOps = new InMemoryCondominiumRequestWriteOps(
			inMemoryContainer,
		);
		condominiumRepoReadOps = new InMemoryCondominiumReadOps(
			inMemoryContainer,
		);
		sut = new MakeCondominiumRequestService(
			condominiumRequestRepoWriteOps,
			condominiumRepoReadOps,
		);
	});

	it('should be able to create a condominium request', async () => {
		const condominium = condominiumFactory();
		const ownerUniqueRegistry = uniqueRegistryFactory();
		const owner = userFactory({
			uniqueRegistryId: ownerUniqueRegistry.id.value,
		});
		await condominiumRepoWriteOps.create({
			condominium,
			user: owner,
			uniqueRegistry: ownerUniqueRegistry,
		});

		const uniqueRegistry = uniqueRegistryFactory({
			email: 'randomuser@email.com',
		});
		const user = userFactory();
		await userRepoWriteOps.create({ user, uniqueRegistry });

		await sut.exec({
			userId: user.id.value,
			uniqueRegistryId: uniqueRegistry.id.value,
			condominiumHumanReadableId: condominium.humanReadableId,
		});
		expect(condominiumRequestRepoWriteOps.calls.create).toEqual(1);
		expect(condominiumRepoReadOps.calls.getCondominiumsByOwnerId).toEqual(
			1,
		);
	});
});
