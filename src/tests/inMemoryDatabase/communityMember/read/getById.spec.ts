import { InMemoryCommunityMembersReadOps } from '.';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

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

		expect(searchedMemberContent?.member.equalTo(member)).toEqual(true);
		expect(
			searchedMemberContent?.communityInfos.equalTo(communityInfos),
		).toEqual(true);
		expect(
			searchedMemberContent?.uniqueRegistry.equalTo(uniqueRegistry),
		).toEqual(true);
		expect(sut.calls.getById).toEqual(1);
	});
});
