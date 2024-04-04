import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryCondominiumRequestWriteOps } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumRequestFactory } from '@tests/factories/condominiumRequest';
import { condominiumFactory } from '@tests/factories/condominium';

describe('InMemoryData test: Condominium request create method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumRequestWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumRequestWriteOps(container);
	});

	it('should be able to create a condominium request', async () => {
		const condominium = condominiumFactory();
		const condominiumRequest = condominiumRequestFactory({
			condominiumId: condominium.id.value,
		});

		await sut.create({
			request: condominiumRequest,
			condominium,
		});

		expect(sut.condominiumRequests[0].equalTo(condominiumRequest)).toBe(
			true,
		);
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to throw one error: condominium request already exist', async () => {
		const condominium = condominiumFactory();
		const condominiumRequest = condominiumRequestFactory({
			condominiumId: condominium.id.value,
		});

		await sut.create({
			request: condominiumRequest,
			condominium,
		});

		await expect(
			sut.create({
				request: condominiumRequest,
				condominium,
			}),
		).rejects.toThrow(
			new InMemoryError({
				message: 'Condominium request doesn\'t exist',
				entity: EntitiesEnum.condominiumRequest,
			}),
		);

		expect(sut.calls.create).toEqual(2);
	});
});
