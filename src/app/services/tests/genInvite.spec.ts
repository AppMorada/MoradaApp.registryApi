import { userFactory } from '@tests/factories/user';
import { CryptSpy } from '@tests/adapters/cryptSpy';
import { GenInviteService } from '../genInvite.service';
import { EmailSpy } from '@tests/adapters/emailSpy';
import { InMemoryOTP } from '@tests/inMemoryDatabase/otp';
import { condominiumFactory } from '@tests/factories/condominium';

describe('Gen invite test', () => {
	let genInvite: GenInviteService;

	let otpRepo: InMemoryOTP;
	let emailAdapter: EmailSpy;
	let crypt: CryptSpy;

	beforeEach(() => {
		otpRepo = new InMemoryOTP();
		crypt = new CryptSpy();
		emailAdapter = new EmailSpy();

		genInvite = new GenInviteService(crypt, emailAdapter, otpRepo);
	});

	it('should be able to create a user', async () => {
		const user = userFactory();
		const condominium = condominiumFactory();

		await genInvite.exec({
			email: user.email,
			condominiumId: condominium.id,
		});

		expect(crypt.calls.hashWithHmac).toEqual(1);
		expect(emailAdapter.calls.send).toEqual(1);
	});
});
