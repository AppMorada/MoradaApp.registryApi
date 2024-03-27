import { GetCommunityMemberByUserIdService } from '@app/services/members/community/getByUserId.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryCommunityMembersReadOps } from '@tests/inMemoryDatabase/communityMember/read';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get community member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCommunityMembersReadOps;

	let sut: GetCommunityMemberByUserIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCommunityMembersReadOps(container);

		sut = new GetCommunityMemberByUserIdService(memberRepo);
	});

	it('should be able to get a member', async () => {
		const user = userFactory();
		const member = condominiumMemberFactory({ userId: user.id.value });
		memberRepo.condominiumMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getByUserId === 1).toEqual(true);
	});
});
