import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumWriteOps } from './';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';

describe('InMemoryData test: Condominium remove method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumWriteOps(container);
	});

	it('should be able to remove one condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });
		sut.condominiums.push(condominium);

		const user1 = userFactory();
		const condominiumMember = condominiumMemberFactory({
			userId: user1.id.value,
			condominiumId: condominium.id.value,
		});
		sut.condominiumMembers.push(condominiumMember);
		sut.users.push(user);

		expect(sut.remove({ id: condominium.id })).resolves;
		expect(sut.condominiums.length === 0).toBe(true);
		expect(sut.condominiumMembers.length === 0).toBe(true);
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
