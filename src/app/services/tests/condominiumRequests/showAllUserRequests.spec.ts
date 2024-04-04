import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryCondominiumRequestWriteOps } from '@tests/inMemoryDatabase/condominiumRequest/write';
import { condominiumFactory } from '@tests/factories/condominium';
import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';
import { InMemoryCondominiumRequestReadOps } from '@tests/inMemoryDatabase/condominiumRequest/read';
import { CondominiumRequestMapper } from '@app/mapper/condominiumRequest';
import { InMemoryUserWriteOps } from '@tests/inMemoryDatabase/user/write';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { ShowAllUserCondominiumRequestsService } from '@app/services/condominiumRequests/showAlllUserRequests';

describe('Show all requests test', () => {
	let sut: ShowAllUserCondominiumRequestsService;
	let inMemoryContainer: InMemoryContainer;
	let condominiumRequestRepoReadOps: InMemoryCondominiumRequestReadOps;
	let condominiumRequestRepoWriteOps: InMemoryCondominiumRequestWriteOps;
	let userRepoWriteOps: InMemoryUserWriteOps;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		userRepoWriteOps = new InMemoryUserWriteOps(inMemoryContainer);
		condominiumRequestRepoReadOps = new InMemoryCondominiumRequestReadOps(
			inMemoryContainer,
		);
		condominiumRequestRepoWriteOps = new InMemoryCondominiumRequestWriteOps(
			inMemoryContainer,
		);
		sut = new ShowAllUserCondominiumRequestsService(
			condominiumRequestRepoReadOps,
		);
	});

	it('should be able to search for a condominium request', async () => {
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

		const { requestCollection } = await sut.exec({ userId: user.id.value });
		const sameRequest = CondominiumRequestMapper.toClass(
			requestCollection!.requests[0],
		);
		const sameEmail = requestCollection?.email;
		const sameName = requestCollection?.name;

		expect(sameRequest.equalTo(request)).toBe(true);
		expect(sameName === user.name.value).toBe(true);
		expect(sameEmail === uniqueRegistry.email.value).toBe(true);
		expect(condominiumRequestRepoReadOps.calls.findByUserId).toEqual(1);
	});
});
