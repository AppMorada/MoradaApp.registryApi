import { GetEnterpriseMemberByUserIdService } from '@app/services/members/enterprise/getByUserId.service';
import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryEnterpriseMembers } from '@tests/inMemoryDatabase/enterpriseMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';

describe('Get enteprise member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEnterpriseMembers;
	let userRepo: InMemoryUser;

	let sut: GetEnterpriseMemberByUserIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEnterpriseMembers(container);
		userRepo = new InMemoryUser(container);

		sut = new GetEnterpriseMemberByUserIdService(memberRepo, userRepo);
	});

	it('should be able to get a member', async () => {
		const user = userFactory();
		const member = enterpriseMemberFactory({ userId: user.id.value });
		memberRepo.enterpriseMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getByUserId === 1).toEqual(true);
	});
});
