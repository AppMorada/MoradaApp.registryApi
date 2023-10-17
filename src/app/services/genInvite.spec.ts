import { userFactory } from '@tests/factories/user';
import { CryptMock } from '@tests/adapters/cryptMock';
import { GenInviteService } from './genInvite.service';
import { EmailMock } from '@tests/adapters/emailMock';
import { InMemoryOTP } from '@tests/inMemoryDatabase/otp';
import { condominiumFactory } from '@tests/factories/condominium';

describe('Gen invite test', () => {
	let genInvite: GenInviteService;

	let otpRepo: InMemoryOTP;
	let emailAdapter: EmailMock;
	let crypt: CryptMock;

	beforeEach(() => {
		otpRepo = new InMemoryOTP();
		crypt = new CryptMock();
		emailAdapter = new EmailMock();

		genInvite = new GenInviteService(crypt, emailAdapter, otpRepo);
	});

	it('should be able to create a user', async () => {
		const user = userFactory();
		const condominium = condominiumFactory();

		const spyOfCrypt = jest.spyOn(CryptMock.prototype, 'hashWithHmac');
		const spyOfEmail = jest.spyOn(EmailMock.prototype, 'send');

		await genInvite.exec({
			email: user.email,
			condominiumId: condominium.id,
		});

		expect(spyOfCrypt).toHaveReturnedTimes(1);
		expect(spyOfEmail).toHaveReturnedTimes(1);
	});
});
