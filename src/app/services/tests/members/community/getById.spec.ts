import { GetCommunityMemberByIdService } from '@app/services/members/community/getById.service';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { InMemoryCommunityMembers } from '@tests/inMemoryDatabase/communityMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';

describe('Get community member by id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCommunityMembers;
	let userRepo: InMemoryUser;

	let sut: GetCommunityMemberByIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCommunityMembers(container);
		userRepo = new InMemoryUser(container);

		sut = new GetCommunityMemberByIdService(memberRepo, userRepo);
	});

	it('should be able to get a member', async () => {
		const member = condominiumMemberFactory();
		memberRepo.condominiumMembers.push(member);

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getById === 1).toEqual(true);
	});
});
