import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryInvite } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { inviteFactory } from '@tests/factories/invite';
import { InMemoryContainer } from '../inMemoryContainer';

describe('InMemoryData test: Invite find method', () => {
	let sut: InMemoryInvite;
	let container: InMemoryContainer;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryInvite(container);
	});

	it('should be able to find one Invite', async () => {
		const invite = inviteFactory();
		sut.invites.push(invite);

		const sut2 = await sut.find({ key: invite.recipient });

		expect(Boolean(sut2)).toBeTruthy();
		expect(sut.calls.find).toEqual(1);
	});

	it('should be able to throw one error: Invite doesn\'t exists', async () => {
		const invite = inviteFactory();

		await expect(
			sut.find({ key: invite.recipient, safeSearch: true }),
		).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite not found',
			}),
		);

		expect(sut.calls.find).toEqual(1);
	});
});
