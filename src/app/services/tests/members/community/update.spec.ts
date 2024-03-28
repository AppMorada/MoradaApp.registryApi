import { UpdateCommunityMemberService } from '@app/services/members/community/updateMember.service';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { inviteFactory } from '@tests/factories/invite';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { userFactory } from '@tests/factories/user';
import { InMemoryCommunityMembersWriteOps } from '@tests/inMemoryDatabase/communityMember/write';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';

describe('Update community member by user id', () => {
	let container: InMemoryContainer;
	let memberRepo: InMemoryCommunityMembersWriteOps;

	let sut: UpdateCommunityMemberService;

	beforeEach(() => {
		container = new InMemoryContainer();
		memberRepo = new InMemoryCommunityMembersWriteOps(container);

		sut = new UpdateCommunityMemberService(memberRepo);
	});

	it('should be able to update a member', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const member = condominiumMemberFactory({ userId: user.id.value });
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});
		const invite = inviteFactory({
			memberId: member.id.value,
			recipient: uniqueRegistry.email.value,
		});
		await memberRepo.createMany({
			members: [
				{
					invite,
					content: member,
					communityInfos,
					rawUniqueRegistry: {
						email: uniqueRegistry.email,
						CPF: uniqueRegistry.CPF!,
					},
				},
			],
		});

		await sut.exec({
			id: member.id.value,
			apartmentNumber: 8954,
			block: 'E54',
		});
		expect(memberRepo.calls.update === 1).toEqual(true);
		expect(memberRepo.communityInfos[0].block.value).toEqual('E54');
		expect(memberRepo.communityInfos[0].apartmentNumber.value).toEqual(
			8954,
		);
	});
});
