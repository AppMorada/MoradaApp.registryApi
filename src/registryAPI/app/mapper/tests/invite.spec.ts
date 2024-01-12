import { inviteFactory } from '@registry:tests/factories/invite';
import { InviteMapper } from '../invite';

describe('Invite Mapper Test', () => {
	it('should be able to convert invite into object and class', () => {
		const invite = inviteFactory();

		const inviteInObject = InviteMapper.toObject(invite);
		const sut = InviteMapper.toClass(inviteInObject);

		expect(sut.equalTo(invite)).toBeTruthy();
	});
});
