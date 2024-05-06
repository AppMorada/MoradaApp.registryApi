import { InMemoryCondominiumRequestCreate } from '@tests/inMemoryDatabase/condominiumRequest/write/create';
import { MakeCondominiumRequestService } from '@app/services/condominiumRequests/makeRequest';
import { InMemoryCondominiumGetByHumanReadableId } from '@tests/inMemoryDatabase/condominium/read/getByHumanReadableId';
import { condominiumFactory } from '@tests/factories/condominium';
import { UUID } from '@app/entities/VO';

describe('Create request test', () => {
	let sut: MakeCondominiumRequestService;
	let createCondominiumRequestRepo: InMemoryCondominiumRequestCreate;
	let getCondominiumRepo: InMemoryCondominiumGetByHumanReadableId;

	beforeEach(() => {
		createCondominiumRequestRepo = new InMemoryCondominiumRequestCreate();
		getCondominiumRepo = new InMemoryCondominiumGetByHumanReadableId();
		sut = new MakeCondominiumRequestService(
			createCondominiumRequestRepo,
			getCondominiumRepo,
		);
	});

	it('should be able to create a condominium request', async () => {
		const condominium = condominiumFactory();

		InMemoryCondominiumGetByHumanReadableId.prototype.exec = jest.fn(
			async () => {
				++getCondominiumRepo.calls.exec;
				return condominium;
			},
		);
		await sut.exec({
			userId: UUID.genV4().value,
			uniqueRegistryId: UUID.genV4().value,
			condominiumHumanReadableId: condominium.humanReadableId,
		});
		expect(createCondominiumRequestRepo.calls.exec).toEqual(1);
		expect(getCondominiumRepo.calls.exec).toEqual(1);
	});
});
