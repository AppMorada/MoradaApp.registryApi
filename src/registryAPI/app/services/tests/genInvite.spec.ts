import { userFactory } from '@registry:tests/factories/user';
import { CryptSpy } from '@registry:tests/adapters/cryptSpy';
import { GenInviteService } from '../genInvite.service';
import { EmailSpy } from '@registry:tests/adapters/emailSpy';
import { condominiumFactory } from '@registry:tests/factories/condominium';
import { InMemoryInvite } from '@registry:tests/inMemoryDatabase/invites';
import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';

describe('Gen invite test', () => {
	let genInvite: GenInviteService;

	let inMemoryContainer: InMemoryContainer;
	let inviteRepo: InMemoryInvite;
	let emailAdapter: EmailSpy;
	let crypt: CryptSpy;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		inviteRepo = new InMemoryInvite(inMemoryContainer);
		crypt = new CryptSpy();
		emailAdapter = new EmailSpy();

		genInvite = new GenInviteService(crypt, emailAdapter, inviteRepo);
	});

	it('should be able to create a user', async () => {
		const user = userFactory();
		const condominium = condominiumFactory();

		await genInvite.exec({
			email: user.email,
			condominiumId: condominium.id,
		});

		expect(inviteRepo.calls.create).toEqual(1);
		expect(crypt.calls.hashWithHmac).toEqual(1);
		expect(emailAdapter.calls.send).toEqual(1);
	});
});
