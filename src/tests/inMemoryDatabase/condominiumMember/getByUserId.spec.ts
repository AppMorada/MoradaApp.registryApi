import { InMemoryCondominiumMembers } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';

describe('InMemoryData test: Condominium Member getByUserId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCondominiumMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCondominiumMembers(container);
	});

	it('should be able to find one member', async () => {
		const user = userFactory();
		const member = condominiumMemberFactory({ userId: user.id.value });
		sut.condominiumMembers.push(member);

		const searchedMembers = await sut.getByUserId({ id: user.id });
		expect(searchedMembers?.[0].id).toEqual(member.id.value);
		expect(sut.calls.getByUserId).toEqual(1);
	});
});
