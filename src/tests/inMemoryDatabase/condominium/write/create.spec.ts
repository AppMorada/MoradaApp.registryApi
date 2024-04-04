import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumWriteOps } from './';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { userFactory } from '@tests/factories/user';

describe('InMemoryData test: Condominium create method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumWriteOps(container);
	});

	it('should be able to create one condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });
		expect(sut.create({ condominium })).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to throw error: condominium already exist', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });

		expect(sut.create({ condominium })).resolves;
		await expect(sut.create({ condominium })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium already exist',
			}),
		);
		expect(sut.calls.create).toEqual(2);
	});
});
