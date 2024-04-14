import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { CondominiumMapper } from '@app/mapper/condominium';
import { GetCondominiumByOwnerIdService } from '@app/services/condominium/getByOwnerId.service';
import { InMemoryCondominiumReadOps } from '@tests/inMemoryDatabase/condominium/read';
import { InMemoryCondominiumWriteOps } from '@tests/inMemoryDatabase/condominium/write';

describe('Get condominium by owner id service test', () => {
	let sut: GetCondominiumByOwnerIdService;

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

		sut = new GetCondominiumByOwnerIdService(condominiumRepoReadOps);
	});

	it('should be able to get a condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });

		await condominiumRepoWriteOps.create({ condominium, user });
		const { condominiums } = await sut.exec({ id: user.id });

		expect(Boolean(condominiums[0])).toEqual(true);

		const parsedCondominium = CondominiumMapper.toClass(condominiums[0]!);
		expect(parsedCondominium.equalTo(condominium)).toEqual(true);
		expect(condominiumRepoReadOps.calls.getCondominiumsByOwnerId).toEqual(
			1,
		);
	});
});
