import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumWriteOps } from './';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { Name } from '@app/entities/VO';

describe('InMemoryData test: Condominium update method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumWriteOps(container);
	});

	it('should be able to update one condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });
		sut.condominiums.push(condominium);
		sut.users.push(user);

		expect(
			sut.update({
				id: condominium.id,
				name: new Name('New name'),
			}),
		).resolves;
		expect(sut.condominiums[0].equalTo(condominium)).toBe(true);
		expect(sut.calls.update).toEqual(1);
	});

	it('should be able to throw error: condominium doesn\'t exist', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });

		expect(
			sut.update({
				id: condominium.id,
				name: new Name('New name'),
			}),
		).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominium,
				message: 'Condominium doesn\'t exist',
			}),
		);
		expect(sut.calls.update).toEqual(1);
	});
});
