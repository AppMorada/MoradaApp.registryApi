import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';
import { CommunityMemberRepoReadOpsInterfaces } from '@app/repositories/communityMember/read';
import { GetCommunityMemberByIdService } from '@app/services/members/community/getById.service';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { userFactory } from '@tests/factories/user';
import { InMemoryCommunityMembersGetById } from '@tests/inMemoryDatabase/communityMember/read/getById';
import { InMemoryUserRead } from '@tests/inMemoryDatabase/user/read';

describe('Get community member by id', () => {
	let getMemberRepo: InMemoryCommunityMembersGetById;
	let getUserRepo: InMemoryUserRead;
	let sut: GetCommunityMemberByIdService;

	beforeEach(() => {
		getMemberRepo = new InMemoryCommunityMembersGetById();
		getUserRepo = new InMemoryUserRead();

		sut = new GetCommunityMemberByIdService(getMemberRepo, getUserRepo);
	});

	it('should be able to get a member', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory();
		const member = condominiumMemberFactory();
		const communityInfos = communityInfosFactory();

		const communityMemberReturnableObjt: CommunityMemberRepoReadOpsInterfaces.performantCondominiumMember =
			{
				condominiumId: member.condominiumId.value,
				id: member.id.value,
				role: member.role.value,
				userId: user.id.value,
				createdAt: member.createdAt,
				updatedAt: member.updatedAt,
			};

		const communityInfosReturnableObjt: CommunityMemberRepoReadOpsInterfaces.performantCommunityInfos =
			{
				updatedAt: communityInfos.updatedAt,
				block: communityInfos.block?.value,
				aparmentNumber: communityInfos.apartmentNumber!.value,
			};

		InMemoryCommunityMembersGetById.prototype.exec = jest.fn(async () => {
			++getMemberRepo.calls.exec;

			return {
				member: communityMemberReturnableObjt,
				communityInfos: communityInfosReturnableObjt,
				uniqueRegistry: UniqueRegistryMapper.toObject(uniqueRegistry),
			};
		});
		InMemoryUserRead.prototype.exec = jest.fn(async () => {
			++getUserRepo.calls.exec;

			return {
				user,
				uniqueRegistry,
			};
		});

		await sut.exec({ id: member.id.value });
		expect(getMemberRepo.calls.exec).toEqual(1);
		expect(getUserRepo.calls.exec).toEqual(1);
	});
});
