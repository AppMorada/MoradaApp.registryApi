import { Invite } from '.';
import { inviteFactory } from '@tests/factories/invite';

describe('Invite entity test', () => {
	it('should be able to create Invite entity', () => {
		const sut = inviteFactory();
		expect(sut).toBeInstanceOf(Invite);
	});
});
