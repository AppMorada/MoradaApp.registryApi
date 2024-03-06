import { CreateUserService } from '../../user/create.service';
import { userFactory } from '@tests/factories/user';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { InMemoryInvite } from '@tests/inMemoryDatabase/invites';
import { inviteFactory } from '@tests/factories/invite';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';

describe('Create user test', () => {
	let sut: CreateUserService;
	let inMemoryContainer: InMemoryContainer;
	let inviteRepo: InMemoryInvite;
	let crypt: CryptSpy;

	beforeEach(() => {
		crypt = new CryptSpy();
		inMemoryContainer = new InMemoryContainer();
		inviteRepo = new InMemoryInvite(inMemoryContainer);
		sut = new CreateUserService(inviteRepo, crypt);
	});

	it('should be able to create a user', async () => {
		const invite = inviteFactory();
		const member = condominiumMemberFactory();
		await inviteRepo.create({ invite });

		const user = userFactory({ email: invite.recipient.value });

		await sut.exec({ user, CPF: member.CPF.value, invite });
		expect(inviteRepo.calls.transferToUserResources).toEqual(1);
	});
});
