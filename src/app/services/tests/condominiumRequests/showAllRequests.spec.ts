import { ShowAllCondominiumRequestsService } from '@app/services/condominiumRequests/showAllRequests';
import { InMemoryCondominiumRequestFindByCondominiumId } from '@tests/inMemoryDatabase/condominiumRequest/read/findByCondominiumId';
import { UUID } from '@app/entities/VO';

describe('Show all requests test', () => {
	let sut: ShowAllCondominiumRequestsService;
	let readCondominiumRequestRepo: InMemoryCondominiumRequestFindByCondominiumId;

	beforeEach(() => {
		readCondominiumRequestRepo =
			new InMemoryCondominiumRequestFindByCondominiumId();
		sut = new ShowAllCondominiumRequestsService(readCondominiumRequestRepo);
	});

	it('should be able to search for a condominium request', async () => {
		await sut.exec({ condominiumId: UUID.genV4().value });
		expect(readCondominiumRequestRepo.calls.exec).toEqual(1);
	});
});
