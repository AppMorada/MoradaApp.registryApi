import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryCommunityMembersWriteOps } from './';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { ApartmentNumber, Block } from '@app/entities/VO';
import { communityInfosFactory } from '@tests/factories/communityInfos';

describe('InMemoryData test: Community Member update method', () => {
	let container: InMemoryContainer;
	let sut: InMemoryCommunityMembersWriteOps;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryCommunityMembersWriteOps(container);
	});

	it('should be able to update one member', async () => {
		const member = condominiumMemberFactory();
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});
		sut.condominiumMembers.push(member);
		sut.communityInfos.push(communityInfos);

		expect(
			sut.update({
				apartmentNumber: new ApartmentNumber(7845),
				id: member.id,
				block: new Block('B8'),
			}),
		).resolves;

		const searchedCommunityInfos = sut.communityInfos?.[0];
		expect(searchedCommunityInfos?.apartmentNumber?.value).toEqual(7845);
		expect(searchedCommunityInfos?.block?.value).toEqual('B8');
		expect(sut.calls.update).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		const member = condominiumMemberFactory();

		await expect(sut.update({ id: member.id })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member doesn\'t exist',
			}),
		);

		expect(sut.calls.update).toEqual(1);
	});
});
