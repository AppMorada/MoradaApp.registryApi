import { CondominiumRequestMapper } from '@app/mapper/condominiumRequest';
import { InMemoryCondominiumRequestReadOps } from '.';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';

describe('InMemoryData test: Condominium request findByUserId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumRequestReadOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumRequestReadOps(container);
	});

	it('should be able to find by user id one condominium request', async () => {
		const condominiumRequest = condominiumRequestFactory();

		sut.condominiumRequests.push(condominiumRequest);
		const data = await sut.findByUserId({
			id: condominiumRequest.userId,
		});

		const request = CondominiumRequestMapper.toClass(data!.requests[0]);
		expect(request.equalTo(condominiumRequest)).toBe(true);
		expect(sut.calls.findByUserId).toEqual(1);
	});
});
