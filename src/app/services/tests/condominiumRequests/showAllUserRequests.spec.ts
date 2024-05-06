import { InMemoryCondominiumRequestFindByUserId } from '@tests/inMemoryDatabase/condominiumRequest/read/findByUserId';
import { ShowAllUserCondominiumRequestsService } from '@app/services/condominiumRequests/showAlllUserRequests';
import { UUID } from '@app/entities/VO';

describe('Show all requests test', () => {
	let sut: ShowAllUserCondominiumRequestsService;
	let readCondominiumRequestRepo: InMemoryCondominiumRequestFindByUserId;

	beforeEach(() => {
		readCondominiumRequestRepo =
			new InMemoryCondominiumRequestFindByUserId();
		sut = new ShowAllUserCondominiumRequestsService(
			readCondominiumRequestRepo,
		);
	});

	it('should be able to search for a condominium request', async () => {
		await sut.exec({ userId: UUID.genV4().value });
		expect(readCondominiumRequestRepo.calls.exec).toEqual(1);
	});
});
