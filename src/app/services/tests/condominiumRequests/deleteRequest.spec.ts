import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryCondominiumRequestWriteOps } from '@tests/inMemoryDatabase/condominiumRequest/write';
import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';
import { condominiumFactory } from '@tests/factories/condominium';
import { DeleteCondominiumRequestService } from '@app/services/condominiumRequests/deleteRequest';

describe('Delete request test', () => {
	let sut: DeleteCondominiumRequestService;
	let inMemoryContainer: InMemoryContainer;
	let condominiumRequestRepo: InMemoryCondominiumRequestWriteOps;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		condominiumRequestRepo = new InMemoryCondominiumRequestWriteOps(
			inMemoryContainer,
		);
		sut = new DeleteCondominiumRequestService(condominiumRequestRepo);
	});

	it('should be able to delete a condominium request', async () => {
		const condominium = condominiumFactory();
		const request = condominiumRequestFactory({
			condominiumId: condominium.id.value,
		});
		await condominiumRequestRepo.create({
			request,
			condominium,
		});

		await sut.exec({
			userId: request.userId.value,
			condominiumId: condominium.id.value,
		});
		expect(
			condominiumRequestRepo.calls.removeByUserIdAndCondominiumId,
		).toEqual(1);
	});
});
