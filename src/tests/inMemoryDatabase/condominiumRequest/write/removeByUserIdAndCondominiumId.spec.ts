import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryCondominiumRequestWriteOps } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';
import { UUID } from '@app/entities/VO';

describe('InMemoryData test: Condominium request removeByUserIdAndCondominiumId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumRequestWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumRequestWriteOps(container);
	});

	it('should be able to remove a condominium request', async () => {
		const userId = UUID.genV4();
		const condominiumId = UUID.genV4();

		const condominiumRequest = condominiumRequestFactory({
			userId: userId.value,
			condominiumId: condominiumId.value,
		});
		sut.condominiumRequests.push(condominiumRequest);

		await sut.removeByUserIdAndCondominiumId({
			userId,
			condominiumId,
		});

		expect(sut.condominiumRequests[0]).toBeFalsy();
		expect(sut.calls.removeByUserIdAndCondominiumId).toEqual(1);
	});

	it('should be able to throw one error: condominiumRequest doesn\'t exist', async () => {
		await expect(
			sut.removeByUserIdAndCondominiumId({
				userId: UUID.genV4(),
				condominiumId: UUID.genV4(),
			}),
		).rejects.toThrow(
			new InMemoryError({
				message: 'Condominium request doesn\'t exist',
				entity: EntitiesEnum.condominiumRequest,
			}),
		);

		expect(sut.calls.removeByUserIdAndCondominiumId).toEqual(1);
	});
});
