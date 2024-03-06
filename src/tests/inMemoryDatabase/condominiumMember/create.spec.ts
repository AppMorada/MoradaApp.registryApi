import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryCondominiumMembers } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';

describe('InMemoryData test: Condominium Member create method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumMembers(container);
	});

	it('should be able to create one member', async () => {
		const member = condominiumMemberFactory();

		expect(sut.create({ member })).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		const member = condominiumMemberFactory();

		expect(sut.create({ member })).resolves;
		await expect(sut.create({ member })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member already exist',
			}),
		);

		expect(sut.calls.create).toEqual(2);
	});
});
