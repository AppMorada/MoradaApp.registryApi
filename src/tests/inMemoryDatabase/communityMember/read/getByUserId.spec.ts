import { communityInfosFactory } from '@tests/factories/communityInfos';
import { InMemoryCommunityMembersReadOps } from '.';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: Community Member getByUserId method', () => {
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

		const searchedMembers = await sut.getByUserId({ id: user.id });
		expect(searchedMembers?.[0].member.id).toEqual(member.id.value);
		expect(sut.calls.getByUserId).toEqual(1);
	});
});
