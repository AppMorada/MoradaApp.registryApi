import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryInvite } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { inviteFactory } from '@tests/factories/invite';
import { userFactory } from '@tests/factories/user';
import { InMemoryContainer } from '../inMemoryContainer';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';
import { UUID } from '@app/entities/VO';

describe('InMemoryData test: Invite', () => {
	let sut: InMemoryInvite;
	let container: InMemoryContainer;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryInvite(container);
	});

	it('should be able to create one Invite', async () => {
		const invite = inviteFactory();
		expect(sut.create({ invite })).resolves;
		expect(sut.calls.create).toEqual(1);
	});

	it('should be able to delete one Invite', async () => {
		const invite = inviteFactory();

		await sut.create({ invite });
		await sut.delete({ key: invite.id });

		expect(Boolean(sut.invites[0])).toBeFalsy();
		expect(sut.calls.create).toEqual(1);
		expect(sut.calls.delete).toEqual(1);
	});

	it('should be able to transfer invite to another collection', async () => {
		const condominiumId = UUID.genV4().value;

		const invite = inviteFactory({ condominiumId });
		const user = userFactory({ email: invite.email.value });
		const condominiumRelUser = condominiumRelUserFactory({ condominiumId });

		await sut.create({ invite });
		await sut.transferToUserResources({
			user,
			condominiumRelUser,
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

	it('should be able to throw one error: Invite does not exist - delete operation', async () => {
		const invite = inviteFactory();
		await expect(sut.delete({ key: invite.id })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite doesn\'t exist',
			}),
		);
		expect(sut.calls.delete).toEqual(1);
	});

	it('should be able to throw one error: Invite already exist', async () => {
		const invite = inviteFactory();
		expect(sut.create({ invite })).resolves;
		await expect(sut.create({ invite })).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite already exist',
			}),
		);
		expect(sut.calls.create).toEqual(2);
	});

	it('should be able to find one Invite', async () => {
		const invite = inviteFactory();
		sut.invites.push(invite);

		const sut2 = await sut.find({ key: invite.email });

		expect(Boolean(sut2)).toBeTruthy();
		expect(sut.calls.find).toEqual(1);
	});

	it('should be able to throw one error: Invite doesn\'t exists', async () => {
		const invite = inviteFactory();

		await expect(
			sut.find({ key: invite.email, safeSearch: true }),
		).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite not found',
			}),
		);

		expect(sut.calls.find).toEqual(1);
	});
});
