import { GetCommunityMemberByUserIdService } from '@app/services/members/community/getByUserId.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { InMemoryCommunityMembersGetByUserId } from '@tests/inMemoryDatabase/communityMember/read/getByUserId';

describe('Get community member by user id', () => {
	let getMemberRepo: InMemoryCommunityMembersGetByUserId;
	let sut: GetCommunityMemberByUserIdService;

	beforeEach(() => {
		getMemberRepo = new InMemoryCommunityMembersGetByUserId();
		sut = new GetCommunityMemberByUserIdService(getMemberRepo);
	});

	it('should be able to get a member', async () => {
		const user = userFactory();
		const member = condominiumMemberFactory({ userId: user.id.value });

		await sut.exec({ id: member.id.value });
		expect(getMemberRepo.calls.exec).toEqual(1);
	});
});
