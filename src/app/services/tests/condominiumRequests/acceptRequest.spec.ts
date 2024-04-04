import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryCondominiumRequestWriteOps } from '@tests/inMemoryDatabase/condominiumRequest/write';
import { AcceptCondominiumRequestService } from '@app/services/condominiumRequests/acceptRequest';
import { condominiumFactory } from '@tests/factories/condominium';
import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { userFactory } from '@tests/factories/user';
import { InMemoryUserWriteOps } from '@tests/inMemoryDatabase/user/write';

describe('Accept request test', () => {
	let sut: AcceptCondominiumRequestService;
	let inMemoryContainer: InMemoryContainer;
	let condominiumRequestRepoWriteOps: InMemoryCondominiumRequestWriteOps;

	let userRepoWriteOps: InMemoryUserWriteOps;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		userRepoWriteOps = new InMemoryUserWriteOps(inMemoryContainer);
		condominiumRequestRepoWriteOps = new InMemoryCondominiumRequestWriteOps(
			inMemoryContainer,
		);
		sut = new AcceptCondominiumRequestService(
			condominiumRequestRepoWriteOps,
		);
	});

	it('should be able to create a condominium request', async () => {
		const condominium = condominiumFactory();
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const request = condominiumRequestFactory({
			condominiumId: condominium.id.value,
			userId: user.id.value,
		});
		await userRepoWriteOps.create({ user, uniqueRegistry });
		await condominiumRequestRepoWriteOps.create({
			request,
			condominium,
		});

		await sut.exec({
			userId: request.userId.value,
			condominiumId: condominium.id.value,
		});
		expect(condominiumRequestRepoWriteOps.calls.acceptRequest).toEqual(1);
	});
});
