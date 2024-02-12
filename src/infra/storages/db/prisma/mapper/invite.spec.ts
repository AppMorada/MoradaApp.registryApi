import { inviteFactory } from '@tests/factories/invite';
import { InvitePrismaMapper } from './invite';

describe('Invite Mapper Prisma Test', () => {
	it('should be able to map invite in prisma', () => {
		const invite = inviteFactory();

		const inviteInPrisma = InvitePrismaMapper.toPrisma(invite);
		const sut = InvitePrismaMapper.toClass(inviteInPrisma);

		expect(sut.equalTo(invite)).toBeTruthy();
	});
});
