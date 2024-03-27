import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryCommunityMembersWriteOps } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { InMemoryContainer } from '../../inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { inviteFactory } from '@tests/factories/invite';

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
		const invite = inviteFactory({
			recipient: uniqueRegistry.email.value,
			memberId: member.id.value,
			condominiumId: member.condominiumId.value,
		});

		expect(
			sut.create({
				member,
				communityInfos,
				invite,
				rawUniqueRegistry: {
					CPF: uniqueRegistry.CPF!,
					email: uniqueRegistry.email,
				},
			}),
		).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to throw one error: member already exist', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const member = condominiumMemberFactory();
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});
		const invite = inviteFactory({
			recipient: uniqueRegistry.email.value,
			memberId: member.id.value,
			condominiumId: member.condominiumId.value,
		});

		expect(
			sut.create({
				member,
				communityInfos,
				invite,
				rawUniqueRegistry: {
					CPF: uniqueRegistry.CPF!,
					email: uniqueRegistry.email,
				},
			}),
		).resolves;
		await expect(
			sut.create({
				member,
				communityInfos,
				invite,
				rawUniqueRegistry: {
					CPF: uniqueRegistry.CPF!,
					email: uniqueRegistry.email,
				},
			}),
		).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member already exist',
			}),
		);

		expect(sut.calls.create).toEqual(2);
	});
});
