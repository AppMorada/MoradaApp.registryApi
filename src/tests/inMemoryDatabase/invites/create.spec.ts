import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryInvite } from '.';
import { EntitiesEnum } from '@app/entities/entities';
import { inviteFactory } from '@tests/factories/invite';
import { InMemoryContainer } from '../inMemoryContainer';

describe('InMemoryData test: Invite create method', () => {
	let sut: InMemoryInvite;
	let container: InMemoryContainer;

	beforeEach(() => {
		container = new InMemoryContainer();
		sut = new InMemoryInvite(container);
	});

	it('should be able to create one Invite', async () => {
		const invite = inviteFactory();
		expect(sut.create({ invite })).resolves;

		const searchedInvite = sut.invites[0];

		expect(searchedInvite.equalTo(invite)).toEqual(true);
		expect(sut.calls.create).toEqual(1);
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
});
