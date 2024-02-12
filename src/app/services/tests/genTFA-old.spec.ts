import { CryptSpy } from '@tests/adapters/cryptSpy';
import { EmailSpy } from '@tests/adapters/emailSpy';
import { userFactory } from '@tests/factories/user';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { GenOldTFASevice } from '../genTFACode.old.service';
import { InMemoryOTP } from '@tests/inMemoryDatabase/otp';

describe('Gen TFA Service (OLD)', () => {
	let genTFA: GenOldTFASevice;

	let inMemoryContainer: InMemoryContainer;
	let otpRepo: InMemoryOTP;
	let emailAdapter: EmailSpy;
	let cryptAdapter: CryptSpy;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		otpRepo = new InMemoryOTP(inMemoryContainer);
		emailAdapter = new EmailSpy();
		cryptAdapter = new CryptSpy();
		genTFA = new GenOldTFASevice(emailAdapter, otpRepo, cryptAdapter);
	});

	it('should be able to gen a TFA', async () => {
		const user = userFactory();

		await genTFA.exec({
			email: user.email,
			userId: user.id,
		});

		expect(otpRepo.calls.create).toEqual(1);
		expect(cryptAdapter.calls.hash).toEqual(1);
		expect(emailAdapter.calls.send).toEqual(1);
	});
});
