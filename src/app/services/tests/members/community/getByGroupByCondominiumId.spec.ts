import { GetCommunityMemberGroupByCondominiumIdService } from '@app/services/members/community/getByGroupByCondominiumId.service';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { inviteFactory } from '@tests/factories/invite';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { InMemoryCommunityMembers } from '@tests/inMemoryDatabase/communityMember';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get community member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCommunityMembers;

	let sut: GetCommunityMemberGroupByCondominiumIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCommunityMembers(container);

		sut = new GetCommunityMemberGroupByCondominiumIdService(memberRepo);
	});

	it('should be able to get a member', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const member = condominiumMemberFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const communityInfos = communityInfosFactory();
		const invite = inviteFactory({
			memberId: member.id.value,
			recipient: uniqueRegistry.email.value,
		});
		await memberRepo.create({
			member,
			invite,
			communityInfos,
			rawUniqueRegistry: {
				email: uniqueRegistry.email,
				CPF: uniqueRegistry.CPF!,
			},
		});

		await sut.exec({ id: member.id.value });
		expect(memberRepo.calls.getGroupCondominiumId === 1).toEqual(true);
	});
});
