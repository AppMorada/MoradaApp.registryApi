import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { InMemoryEnterpriseMembers } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { userFactory } from '@tests/factories/user';

describe('InMemoryData test: Enterprise Member getByUserId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryEnterpriseMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryEnterpriseMembers(container);
	});

	it('should be able to find one member', async () => {
		const user = userFactory();
		const member = enterpriseMemberFactory({ userId: user.id.value });
		sut.enterpriseMembers.push(member);

		const searchedMember = await sut.getByUserId({ id: user.id });
		expect(searchedMember?.equalTo(member));
		expect(sut.calls.getByUserId).toEqual(1);
	});
});
