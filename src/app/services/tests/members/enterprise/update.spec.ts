import { UpdateEnterpriseMemberService } from '@app/services/members/enterprise/updateMember.service';
import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryEnterpriseMembers } from '@tests/inMemoryDatabase/enterpriseMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Update enteprise member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEnterpriseMembers;

	let sut: UpdateEnterpriseMemberService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEnterpriseMembers(container);

		sut = new UpdateEnterpriseMemberService(memberRepo);
	});

	it('should be able to update a member', async () => {
		const user = userFactory();
		const member = enterpriseMemberFactory({ userId: user.id.value });
		memberRepo.enterpriseMembers.push(member);
		memberRepo.users.push(user);

		await sut.exec({
			id: member.id.value,
			name: 'new name',
		});
		expect(memberRepo.calls.update === 1).toEqual(true);
		expect(memberRepo.users[0].name.value).toEqual('new name');
	});
});
