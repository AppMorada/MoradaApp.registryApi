import { InMemoryCondominiumMembers } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';

describe('InMemoryData test: Condominium Member createMany method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumMembers(container);
	});

	it('should be able to create one user', async () => {
		const newMember1 = condominiumMemberFactory();
		const newMember2 = condominiumMemberFactory();

		expect(
			sut.createMany({
				members: [{ content: newMember1 }, { content: newMember2 }],
			}),
		).resolves;
		expect(sut.calls.createMany).toEqual(1);
		expect(sut.calls.create).toEqual(2);
	});
});
