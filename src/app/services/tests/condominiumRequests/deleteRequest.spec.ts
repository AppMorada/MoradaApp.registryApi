import { InMemoryCondominiumRequestRemove } from '@tests/inMemoryDatabase/condominiumRequest/write/removeByUserIdAndCondominiumId';
import { DeleteCondominiumRequestService } from '@app/services/condominiumRequests/deleteRequest';
import { UUID } from '@app/entities/VO';

describe('Delete request test', () => {
	let sut: DeleteCondominiumRequestService;
	let removeCondominiumRequestRepo: InMemoryCondominiumRequestRemove;

	beforeEach(() => {
		removeCondominiumRequestRepo = new InMemoryCondominiumRequestRemove();
		sut = new DeleteCondominiumRequestService(removeCondominiumRequestRepo);
	});

	it('should be able to delete a condominium request', async () => {
		await sut.exec({
			userId: UUID.genV4().value,
			condominiumId: UUID.genV4().value,
		});
		expect(removeCondominiumRequestRepo.calls.exec).toEqual(1);
	});
});
