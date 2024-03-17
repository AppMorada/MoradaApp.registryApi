import { communityInfosFactory } from '@tests/factories/communityInfos';
import { InMemoryCommunityMembers } from '.';
import { InMemoryContainer } from '../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { CondominiumMemberMapper } from '@app/mapper/condominiumMember';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';
import { CommunityInfoMapper } from '@app/mapper/communityInfo';

describe('InMemoryData test: Community Member getGroupCondominiumId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCommunityMembers;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCommunityMembers(container);
	});

	it('should be able to find one member', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const member = condominiumMemberFactory({
			userId: user.id.value,
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});
		sut.uniqueRegistries.push(uniqueRegistry);
		sut.condominiumMembers.push(member);
		sut.communityInfos.push(communityInfos);
		sut.users.push(user);

		const searchedMemberContent = await sut.getGroupCondominiumId({
			condominiumId: member.condominiumId,
		});

		expect(
			CondominiumMemberMapper.toClass(
				searchedMemberContent[0].member,
			).equalTo(member),
		).toBe(true);
		expect(
			UniqueRegistryMapper.toClass(
				searchedMemberContent[0].uniqueRegistry,
			).equalTo(uniqueRegistry),
		).toBe(true);
		expect(
			CommunityInfoMapper.toClass(
				searchedMemberContent[0].communityInfos,
			).equalTo(communityInfos),
		).toBe(true);
		expect(sut.calls.getGroupCondominiumId).toEqual(1);
	});
});
