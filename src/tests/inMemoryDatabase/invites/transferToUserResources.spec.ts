import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryInvite } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { inviteFactory } from '@tests/factories/invite';
import { userFactory } from '@tests/factories/user';
import { InMemoryContainer } from '../inMemoryContainer';
import { UUID } from '@app/entities/VO';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';

describe('InMemoryData test: Invite transferToUserResources method', () => {
	let sut: InMemoryInvite;
	let container: InMemoryContainer;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryInvite(container);
	});

	it('should be able to transfer invite to another collection', async () => {
		const condominiumId = UUID.genV4().value;

		const invite = inviteFactory({ condominiumId });
		const user = userFactory({ email: invite.recipient.value });
		const member = condominiumMemberFactory({
			userId: user.id.value,
			condominiumId,
		});

		await sut.create({ invite });
		await sut.transferToUserResources({
			user,
			condominiumId: member.condominiumId,
		});

		expect(Boolean(sut.invites[0])).toBeFalsy();

		await expect(sut.create({ invite })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'User is already linked in one condominium',
			}),
		);

		expect(sut.calls.create).toEqual(2);
		expect(sut.calls.transferToUserResources).toEqual(1);
	});
});
