import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumReadOps } from '.';
import { InMemoryContainer } from '../../inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { CondominiumMapper } from '@app/mapper/condominium';

describe('InMemoryData test: Condominium getCondominiumsByOwnerId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumReadOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumReadOps(container);
	});

	it('should be able to find one condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory({ ownerId: user.id.value });
		sut.condominiums.push(condominium);

		const data = await sut.getCondominiumsByOwnerId({ id: user.id });
		expect(CondominiumMapper.toClass(data[0]).equalTo(condominium)).toEqual(
			true,
		);
		expect(sut.calls.getCondominiumsByOwnerId).toEqual(1);
	});
});
