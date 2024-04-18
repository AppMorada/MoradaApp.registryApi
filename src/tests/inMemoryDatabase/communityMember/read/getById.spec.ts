import { InMemoryCommunityMembersReadOps } from '.';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { CondominiumMemberMapper } from '@app/mapper/condominiumMember';
import { CommunityInfoMapper } from '@app/mapper/communityInfo';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';

describe('InMemoryData test: Community Member getById method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCommunityMembersReadOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCommunityMembersReadOps(container);
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

		const searchedMemberContent = await sut.getById({ id: member.id });

		const searchedMemberInstance = CondominiumMemberMapper.toClass({
			...searchedMemberContent!.member,
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const searchedCommunityInfosInstance = CommunityInfoMapper.toClass({
			memberId: member.id.value,
			...searchedMemberContent!.communityInfos,
		});

		expect(member.equalTo(searchedMemberInstance)).toEqual(true);
		expect(communityInfos.equalTo(searchedCommunityInfosInstance)).toEqual(
			true,
		);
		expect(
			uniqueRegistry.equalTo(
				UniqueRegistryMapper.toClass(
					searchedMemberContent!.uniqueRegistry,
				),
			),
		).toEqual(true);
		expect(sut.calls.getById).toEqual(1);
	});
});
