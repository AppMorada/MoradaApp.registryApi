import { InMemoryCondominiumSearch } from '@tests/inMemoryDatabase/condominium/read/find';
import { GetCondominiumService } from '@app/services/condominium/get.service';
import { UUID } from '@app/entities/VO';

describe('Get condominium service test', () => {
	let sut: GetCondominiumService;
	let searchCondominiumRepo: InMemoryCondominiumSearch;

	beforeEach(() => {
		searchCondominiumRepo = new InMemoryCondominiumSearch();
		sut = new GetCondominiumService(searchCondominiumRepo);
	});

	it('should be able to get a condominium', async () => {
		await sut.exec({ id: UUID.genV4() });
		expect(searchCondominiumRepo.calls.exec).toEqual(1);
	});
});
