import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryCondominiumMembers } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { UUID } from '@app/entities/VO';

describe('InMemoryData test: Condominium Member create method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumMembers(container);
	});

	it('should be able to create one member', async () => {
		const member = condominiumMemberFactory();

		sut.condominiumMembers.push(member);
		expect(sut.remove({ id: member.id })).resolves;
		expect(sut.calls.remove).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		await expect(sut.remove({ id: UUID.genV4() })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member doesn\'t exist',
			}),
		);

		expect(sut.calls.remove).toEqual(1);
	});
});
