import { GetCommunityMemberGroupByCondominiumIdService } from '@app/services/members/community/getByGroupByCondominiumId.service';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { inviteFactory } from '@tests/factories/invite';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { InMemoryCommunityMembersReadOps } from '@tests/inMemoryDatabase/communityMember/read';
import { InMemoryCommunityMembersWriteOps } from '@tests/inMemoryDatabase/communityMember/write';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Get community member by user id', () => {
	let container: InMemoryContainer;
	let memberRepoReadOps: InMemoryCommunityMembersReadOps;
	let memberRepoWriteOps: InMemoryCommunityMembersWriteOps;

	let sut: GetCommunityMemberGroupByCondominiumIdService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepoReadOps = new InMemoryCommunityMembersReadOps(container);
		memberRepoWriteOps = new InMemoryCommunityMembersWriteOps(container);

		sut = new GetCommunityMemberGroupByCondominiumIdService(
			memberRepoReadOps,
		);
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
		await memberRepoWriteOps.createMany({
			members: [
				{
					content: member,
					invite,
					communityInfos,
					rawUniqueRegistry: {
						email: uniqueRegistry.email,
						CPF: uniqueRegistry.CPF!,
					},
				},
			],
		});

		await sut.exec({ id: member.id.value });
		expect(memberRepoReadOps.calls.getGroupCondominiumId === 1).toEqual(
			true,
		);
	});
});
