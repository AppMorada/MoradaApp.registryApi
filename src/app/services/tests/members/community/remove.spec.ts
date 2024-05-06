import { UUID } from '@app/entities/VO';
import { RemoveCommunityMemberService } from '@app/services/members/community/removeMember.service';
import { InMemoryCommunityMembersRemove } from '@tests/inMemoryDatabase/communityMember/write/remove';

describe('Get community member by user id', () => {
	let removeMemberRepo: InMemoryCommunityMembersRemove;
	let sut: RemoveCommunityMemberService;

	beforeEach(() => {
		removeMemberRepo = new InMemoryCommunityMembersRemove();
		sut = new RemoveCommunityMemberService(removeMemberRepo);
	});

	it('should be able to get a member', async () => {
		await sut.exec({ id: UUID.genV4().value });
		expect(removeMemberRepo.calls.exec).toEqual(1);
	});
});
