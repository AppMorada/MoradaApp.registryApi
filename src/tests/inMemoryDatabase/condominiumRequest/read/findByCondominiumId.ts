import { CondominiumRequestMapper } from '@app/mapper/condominiumRequest';
import { InMemoryCondominiumRequestReadOps } from '.';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';

describe('InMemoryData test: Condominium request findByCondominiumId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumRequestReadOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumRequestReadOps(container);
	});

	it('should be able to find by condominium id one condominium request', async () => {
		const condominiumRequest = condominiumRequestFactory();

		sut.condominiumRequests.push(condominiumRequest);
		const data = await sut.findByCondominiumId({
			id: condominiumRequest.condominiumId,
		});
		const parsedCondominiumRequest = CondominiumRequestMapper.toClass(
			data[0].request,
		);

		expect(parsedCondominiumRequest.equalTo(condominiumRequest)).toBe(true);
		expect(sut.calls.findByCondominiumId).toEqual(1);
	});
});
