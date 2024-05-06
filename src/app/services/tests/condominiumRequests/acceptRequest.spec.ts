import { InMemoryCondominiumRequestAcceptRequest } from '@tests/inMemoryDatabase/condominiumRequest/write/acceptRequest';
import { AcceptCondominiumRequestService } from '@app/services/condominiumRequests/acceptRequest';
import { UUID } from '@app/entities/VO';

describe('Accept request test', () => {
	let sut: AcceptCondominiumRequestService;
	let acceptCondominiumRequestRepo: InMemoryCondominiumRequestAcceptRequest;

	beforeEach(() => {
		acceptCondominiumRequestRepo =
			new InMemoryCondominiumRequestAcceptRequest();
		sut = new AcceptCondominiumRequestService(acceptCondominiumRequestRepo);
	});

	it('should be able to create a condominium request', async () => {
		await sut.exec({
			userId: UUID.genV4().value,
			condominiumId: UUID.genV4().value,
		});
		expect(acceptCondominiumRequestRepo.calls.exec).toEqual(1);
	});
});
