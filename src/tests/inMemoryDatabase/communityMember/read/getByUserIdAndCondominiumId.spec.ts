import { communityInfosFactory } from '@tests/factories/communityInfos';
import { InMemoryCommunityMembersReadOps } from '.';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { userFactory } from '@tests/factories/user';

describe('InMemoryData test: Community Member getByUserAndCondominiumId method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCommunityMembersReadOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCommunityMembersReadOps(container);
	});

	it('should be able to get member with the same user id and condominium id', async () => {
		const user = userFactory();
		const member = condominiumMemberFactory({ userId: user.id.value });
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});
		sut.condominiumMembers.push(member);
		sut.communityInfos.push(communityInfos);

		const result = await sut.getByUserAndCondominiumId({
			condominiumId: member.condominiumId,
			userId: user.id,
		});
		expect(result?.member.equalTo(member)).toBe(true);
		expect(result?.communityInfos.equalTo(communityInfos)).toBe(true);
		expect(sut.calls.getByUserAndCondominiumId).toEqual(1);
	});
});
