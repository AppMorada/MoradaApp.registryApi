import { RemoveEntepriseMemberService } from '@app/services/members/enterprise/removeMember.service';
import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryEnterpriseMembers } from '@tests/inMemoryDatabase/enterpriseMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get enterprise member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEnterpriseMembers;

	let sut: RemoveEntepriseMemberService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEnterpriseMembers(container);

		sut = new RemoveEntepriseMemberService(memberRepo);
	});

	it('should be able to get a member', async () => {
		const user = userFactory();
		const member = enterpriseMemberFactory({ userId: user.id.value });
		memberRepo.enterpriseMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.remove === 1).toEqual(true);
	});
});
