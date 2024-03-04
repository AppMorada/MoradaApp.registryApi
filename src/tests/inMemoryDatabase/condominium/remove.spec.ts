import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominium } from '.';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { userFactory } from '@tests/factories/user';

describe('InMemoryData test: Condominium remove method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominium;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominium(container);
	});

	it('should be able to remove one condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });
		sut.condominiums.push(condominium);
		sut.users.push(user);

		expect(sut.remove({ id: condominium.id })).resolves;
		expect(sut.condominiums.length === 0).toBe(true);
		expect(sut.calls.remove).toEqual(1);
	});

	it('should be able to throw error: Condominium doesn\'t exist', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });

		expect(sut.remove({ id: condominium.id })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium doesn\'t exist',
			}),
		);
		expect(sut.calls.remove).toEqual(1);
	});
});
