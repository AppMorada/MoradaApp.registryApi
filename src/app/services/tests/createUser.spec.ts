import { CreateUserService } from '../createUser.service';
import { userFactory } from '@tests/factories/user';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { InMemoryInvite } from '@tests/inMemoryDatabase/invites';
import { inviteFactory } from '@tests/factories/invite';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';

describe('Create user test', () => {
	let createUser: CreateUserService;
	let inMemoryContainer: InMemoryContainer;
	let inviteRepo: InMemoryInvite;
	let crypt: CryptSpy;

	beforeEach(() => {
		crypt = new CryptSpy();
		inMemoryContainer = new InMemoryContainer();
		inviteRepo = new InMemoryInvite(inMemoryContainer);
		createUser = new CreateUserService(inviteRepo, crypt);
	});

	it('should be able to create a user', async () => {
		const invite = inviteFactory();
		await inviteRepo.create({ invite });

		const user = userFactory({ email: invite.email.value });
		const condominiumRelUser = condominiumRelUserFactory();
		await createUser.exec({
			user,
			invite,
			block: condominiumRelUser.block,
			apartmentNumber: condominiumRelUser.apartmentNumber,
		});
		expect(inviteRepo.calls.transferToUserResources).toEqual(1);
	});
});
