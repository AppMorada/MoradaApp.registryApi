import { GetEnterpriseMemberByIdService } from '@app/services/members/enterprise/getById.service';
import { enterpriseMemberFactory } from '@tests/factories/enterpriseMember';
import { InMemoryEnterpriseMembers } from '@tests/inMemoryDatabase/enterpriseMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';

describe('Get enterprise member by id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryEnterpriseMembers;
	let userRepo: InMemoryUser;

	let sut: GetEnterpriseMemberByIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryEnterpriseMembers(container);
		userRepo = new InMemoryUser(container);

		sut = new GetEnterpriseMemberByIdService(memberRepo, userRepo);
	});

	it('should be able to get a member', async () => {
		const member = enterpriseMemberFactory();
		memberRepo.enterpriseMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getById === 1).toEqual(true);
	});
});
