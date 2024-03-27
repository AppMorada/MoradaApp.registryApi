import { GetCommunityMemberByIdService } from '@app/services/members/community/getById.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { InMemoryCommunityMembersReadOps } from '@tests/inMemoryDatabase/communityMember/read';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUserReadOps } from '@tests/inMemoryDatabase/user/read';

describe('Get community member by id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCommunityMembersReadOps;
	let userRepo: InMemoryUserReadOps;

	let sut: GetCommunityMemberByIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCommunityMembersReadOps(container);
		userRepo = new InMemoryUserReadOps(container);

		sut = new GetCommunityMemberByIdService(memberRepo, userRepo);
	});

	it('should be able to get a member', async () => {
		const member = condominiumMemberFactory();
		memberRepo.condominiumMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getById === 1).toEqual(true);
	});
});
