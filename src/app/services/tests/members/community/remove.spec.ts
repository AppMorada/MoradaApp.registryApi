import { UUID } from '@app/entities/VO';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';
import { CommunityMemberRepoReadOpsInterfaces } from '@app/repositories/communityMember/read';
import { RemoveCommunityMemberService } from '@app/services/members/community/removeMember.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { InMemoryCommunityMembersGetById } from '@tests/inMemoryDatabase/communityMember/read/getById';
import { InMemoryCommunityMembersRemove } from '@tests/inMemoryDatabase/communityMember/write/remove';

describe('Remove community member by user id', () => {
	let removeMemberRepo: InMemoryCommunityMembersRemove;
	let memberRepoGetRepo: InMemoryCommunityMembersGetById;
	let eventEmitter: EventEmitter2;
	let sut: RemoveCommunityMemberService;

	beforeEach(() => {
		removeMemberRepo = new InMemoryCommunityMembersRemove();
		memberRepoGetRepo = new InMemoryCommunityMembersGetById();
		eventEmitter = new EventEmitter2();
		sut = new RemoveCommunityMemberService(
			removeMemberRepo,
			memberRepoGetRepo,
			eventEmitter,
		);
	});

	it('should be able to remove a member', async () => {
		EventEmitter2.prototype.emit = jest.fn(() => true);

		const member = condominiumMemberFactory();
		const performantMember: CommunityMemberRepoReadOpsInterfaces.performantCondominiumMember =
			{
				id: member.id.value,
				userId: member.userId?.value,
				condominiumId: member.condominiumId.value,
				role: member.role.value,
				updatedAt: member.updatedAt,
				createdAt: member.createdAt,
			};

		const communityInfos = communityInfosFactory();
		const performantCommunityInfos: CommunityMemberRepoReadOpsInterfaces.performantCommunityInfos =
			{
				aparmentNumber: communityInfos.apartmentNumber?.value,
				block: communityInfos.block?.value,
				updatedAt: communityInfos.updatedAt,
			};

		const uniqueRegistry = uniqueRegistryFactory();

		InMemoryCommunityMembersGetById.prototype.exec = jest.fn(async () => {
			++memberRepoGetRepo.calls.exec;
			return {
				member: performantMember,
				communityInfos: performantCommunityInfos,
				uniqueRegistry: UniqueRegistryMapper.toObject(uniqueRegistry),
			};
		});

		await sut.exec({ id: UUID.genV4().value });
		expect(removeMemberRepo.calls.exec).toEqual(1);
		expect(memberRepoGetRepo.calls.exec).toEqual(1);
	});
});
