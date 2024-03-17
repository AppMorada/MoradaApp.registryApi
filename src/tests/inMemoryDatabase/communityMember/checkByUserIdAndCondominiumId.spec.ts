import { InMemoryCommunityMembers } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';

describe('InMemoryData test: Community Member checkByUserAndCondominiumId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCommunityMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCommunityMembers(container);
	});

	it('should be able to counter the member with the same user id and condominium id', async () => {
		const user = userFactory();
		const member = condominiumMemberFactory({ userId: user.id.value });
		sut.condominiumMembers.push(member);

		const counter = await sut.checkByUserAndCondominiumId({
			condominiumId: member.condominiumId,
			userId: user.id,
		});
		expect(counter).toEqual(1);
		expect(sut.calls.checkByUserAndCondominiumId).toEqual(1);
	});
});
