import { inviteFactory } from '@tests/factories/invite';
import { InviteMapper } from '../invite';

describe('Invite Mapper Test', () => {
	it('should be able to convert invite into object and class', () => {
		const sut = inviteFactory();

		const objt = InviteMapper.toObject(sut);
		const classInvite = InviteMapper.toClass(objt);

		expect(sut.equalTo(classInvite)).toBeTruthy();
	});
});
