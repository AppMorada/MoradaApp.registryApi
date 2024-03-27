import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryCommunityMembersWriteOps } from './';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { UUID } from '@app/entities/VO';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: Community Member create method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCommunityMembersWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCommunityMembersWriteOps(container);
	});

	it('should be able to create one member', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const member = condominiumMemberFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});
		sut.uniqueRegistries.push(uniqueRegistry);
		sut.condominiumMembers.push(member);
		sut.communityInfos.push(communityInfos);

		expect(sut.remove({ id: member.id })).resolves;
		expect(sut.calls.remove).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		await expect(sut.remove({ id: UUID.genV4() })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member doesn\'t exist',
			}),
		);

		expect(sut.calls.remove).toEqual(1);
	});
});
