import { UUID } from '@app/entities/VO';
import { UpdateCommunityMemberService } from '@app/services/members/community/updateMember.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { InMemoryCommunityMembersUpdate } from '@tests/inMemoryDatabase/communityMember/write/update';

describe('Update community member by user id', () => {
	let updateMemberRepo: InMemoryCommunityMembersUpdate;
	let sut: UpdateCommunityMemberService;

	beforeEach(() => {
		updateMemberRepo = new InMemoryCommunityMembersUpdate();
		sut = new UpdateCommunityMemberService(updateMemberRepo);
	});

	it('should be able to update a member', async () => {
		const member = condominiumMemberFactory({ userId: UUID.genV4().value });

		await sut.exec({
			id: member.id.value,
			apartmentNumber: 8954,
			block: 'E54',
		});
		expect(updateMemberRepo.calls.exec).toEqual(1);
	});
});
