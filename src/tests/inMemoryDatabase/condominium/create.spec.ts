import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '.';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { userFactory } from '@tests/factories/user';

describe('InMemoryData test: Condominium create method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominium;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominium(container);
	});

	it('should be able to create one condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });
		expect(sut.create({ condominium, user })).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to throw error: condominium already exist', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });
		expect(sut.create({ condominium, user })).resolves;
		await expect(sut.create({ condominium, user })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium already exist',
			}),
		);
		expect(sut.calls.create).toEqual(2);
	});
});
