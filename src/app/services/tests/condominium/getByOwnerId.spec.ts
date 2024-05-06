import { GetCondominiumByOwnerIdService } from '@app/services/condominium/getByOwnerId.service';
import { InMemoryCondominiumGetByOwnerId } from '@tests/inMemoryDatabase/condominium/read/getOwnerById';
import { UUID } from '@app/entities/VO';

describe('Get condominium by owner id service test', () => {
	let sut: GetCondominiumByOwnerIdService;
	let getByOwnerIdcondominiumRepo: InMemoryCondominiumGetByOwnerId;

	beforeEach(() => {
		getByOwnerIdcondominiumRepo = new InMemoryCondominiumGetByOwnerId();
		sut = new GetCondominiumByOwnerIdService(getByOwnerIdcondominiumRepo);
	});

	it('should be able to get a condominium', async () => {
		await sut.exec({ id: UUID.genV4() });
		expect(getByOwnerIdcondominiumRepo.calls.exec).toEqual(1);
	});
});
