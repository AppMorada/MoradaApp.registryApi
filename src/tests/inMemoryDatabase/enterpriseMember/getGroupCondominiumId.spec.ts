import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { InMemoryEnterpriseMembers } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { userFactory } from '@tests/factories/user';
import { UserMapper } from '@app/mapper/user';

describe('InMemoryData test: Enterprise Member getGroupCondominiumId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryEnterpriseMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryEnterpriseMembers(container);
	});

	it('should be able to find one member', async () => {
		const user = userFactory();
		const member = enterpriseMemberFactory({ userId: user.id.value });
		sut.users.push(user);
		sut.enterpriseMembers.push(member);

		const searchedMember = await sut.getGroupCondominiumId({
			condominiumId: member.condominiumId,
		});
		expect(UserMapper.toClass(searchedMember[0]).equalTo(user));
		expect(sut.calls.getGroupCondominiumId).toEqual(1);
	});
});
