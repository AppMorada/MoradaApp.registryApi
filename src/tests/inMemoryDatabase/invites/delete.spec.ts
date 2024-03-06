import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryInvite } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { inviteFactory } from '@tests/factories/invite';
import { InMemoryContainer } from '../inMemoryContainer';

describe('InMemoryData test: Invite delete method', () => {
	let sut: InMemoryInvite;
	let container: InMemoryContainer;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryInvite(container);
	});

	it('should be able to delete one Invite', async () => {
		const invite = inviteFactory();

		await sut.create({ invite });
		await sut.delete({ key: invite.id });

		expect(Boolean(sut.invites[0])).toBeFalsy();
		expect(sut.calls.create).toEqual(1);
		expect(sut.calls.delete).toEqual(1);
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
});
