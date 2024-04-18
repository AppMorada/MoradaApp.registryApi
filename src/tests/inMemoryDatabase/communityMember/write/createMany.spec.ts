import { communityInfosFactory } from '@tests/factories/communityInfos';
import { InMemoryCommunityMembersWriteOps } from './';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: Community Member createMany method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCommunityMembersWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCommunityMembersWriteOps(container);
	});

	it('should be able to create one user', async () => {
		const uniqueRegistry1 = uniqueRegistryFactory({
			email: 'johndoe@email.com',
		});
		const newMember1 = condominiumMemberFactory({
			uniqueRegistryId: uniqueRegistry1.id.value,
		});
		const newCommunityInfo1 = communityInfosFactory({
			memberId: newMember1.id.value,
		});

		const uniqueRegistry2 = uniqueRegistryFactory({
			email: 'dianadoe@email.com',
		});
		const newMember2 = condominiumMemberFactory({
			uniqueRegistryId: uniqueRegistry2.id.value,
		});
		const newCommunityInfo2 = communityInfosFactory({
			memberId: newMember2.id.value,
		});

		expect(
			sut.createMany({
				members: [
					{
						content: newMember1,
						rawUniqueRegistry: {
							email: uniqueRegistry1.email,
						},
						communityInfos: newCommunityInfo1,
					},
					{
						content: newMember2,
						rawUniqueRegistry: {
							email: uniqueRegistry2.email,
						},
						communityInfos: newCommunityInfo2,
					},
				],
			}),
		).resolves;
		expect(sut.calls.createMany).toEqual(1);
	});
});
