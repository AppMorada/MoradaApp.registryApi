import { GetCommunityMemberGroupByCondominiumIdService } from '@app/services/members/community/getByGroupByCondominiumId.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { InMemoryCommunityMembersGetGroupCondominiumId } from '@tests/inMemoryDatabase/communityMember/read/getGroupCondominiumId';

describe('Get community member by user id', () => {
	let getMemberRepo: InMemoryCommunityMembersGetGroupCondominiumId;

	let sut: GetCommunityMemberGroupByCondominiumIdService;

	beforeEach(() => {
		getMemberRepo = new InMemoryCommunityMembersGetGroupCondominiumId();

		sut = new GetCommunityMemberGroupByCondominiumIdService(getMemberRepo);
	});

	it('should be able to get a member', async () => {
		const member = condominiumMemberFactory();

		await sut.exec({ id: member.id.value });
		expect(getMemberRepo.calls.exec).toEqual(1);
	});
});
