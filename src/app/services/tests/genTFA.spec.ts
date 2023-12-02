import { CryptSpy } from '@tests/adapters/cryptSpy';
import { EmailSpy } from '@tests/adapters/emailSpy';
import { InMemoryOTP } from '@tests/inMemoryDatabase/otp';
import { GenTFAService } from '../genTFA.service';
import { userFactory } from '@tests/factories/user';

describe('Gen TFA Service', () => {
	let genTFA: GenTFAService;

	let otpRepo: InMemoryOTP;
	let emailAdapter: EmailSpy;
	let cryptAdapter: CryptSpy;

	beforeEach(() => {
		otpRepo = new InMemoryOTP();
		emailAdapter = new EmailSpy();
		cryptAdapter = new CryptSpy();

		genTFA = new GenTFAService(emailAdapter, otpRepo, cryptAdapter);
	});

	it('should be able to gen a TFA', async () => {
		const user = userFactory();

		await genTFA.exec({
			email: user.email,
			userId: user.id,
			condominiumId: user.condominiumId,
		});

		expect(cryptAdapter.calls.hash).toEqual(1);
		expect(emailAdapter.calls.send).toEqual(1);
		expect(otpRepo.calls.create).toEqual(1);
	});
});
