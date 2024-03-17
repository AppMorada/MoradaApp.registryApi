import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryInvite } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { inviteFactory } from '@tests/factories/invite';
import { userFactory } from '@tests/factories/user';
import { InMemoryContainer } from '../inMemoryContainer';
import { UUID } from '@app/entities/VO';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('InMemoryData test: Invite transferToUserResources method', () => {
	let sut: InMemoryInvite;
	let container: InMemoryContainer;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryInvite(container);
	});

	it('should be able to transfer invite to another collection', async () => {
		const condominiumId = UUID.genV4().value;

		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const member = condominiumMemberFactory({
			uniqueRegistryId: uniqueRegistry.id.value,
			condominiumId,
		});
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});
		const invite = inviteFactory({
			memberId: member.id.value,
			condominiumId,
			recipient: uniqueRegistry.email.value,
		});

		sut.uniqueRegistries.push(uniqueRegistry);
		sut.condominiumMembers.push(member);
		sut.communityInfos.push(communityInfos);
		sut.invites.push(invite);

		await sut.transferToUserResources({
			user,
			invite,
			rawUniqueRegistry: {
				email: uniqueRegistry.email,
				CPF: uniqueRegistry.CPF!,
			},
		});

		expect(Boolean(sut.invites[0])).toBeFalsy();

		await expect(
			sut.transferToUserResources({
				invite,
				user,
				rawUniqueRegistry: {
					email: uniqueRegistry.email,
					CPF: uniqueRegistry.CPF!,
				},
			}),
		).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Invite or condominium member doesn\'t exist',
			}),
		);

		expect(sut.calls.transferToUserResources).toEqual(2);
	});
});
