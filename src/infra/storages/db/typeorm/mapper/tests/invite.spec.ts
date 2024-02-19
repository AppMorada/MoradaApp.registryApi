import { TypeOrmInviteMapper } from '../invite';
import { inviteFactory } from '@tests/factories/invite';
import { InviteMapper } from '@app/mapper/invite';

describe('TypeORM Invite entity mapper', () => {
	it('should be able to validate the mapper', () => {
		const sut = inviteFactory();
		const inviteAsTypeOrm = TypeOrmInviteMapper.toTypeOrm(sut);
		const inviteAsClass = TypeOrmInviteMapper.toClass(inviteAsTypeOrm);

		const inviteAsObject = TypeOrmInviteMapper.toObject(inviteAsTypeOrm);
		const inviteAsClass2 = InviteMapper.toClass(inviteAsObject);

		expect(sut.equalTo(inviteAsClass)).toEqual(true);
		expect(sut.equalTo(inviteAsClass2)).toEqual(true);
	});
});
