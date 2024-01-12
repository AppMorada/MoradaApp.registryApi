import { CryptSpy } from '@registry:tests/adapters/cryptSpy';
import { EmailSpy } from '@registry:tests/adapters/emailSpy';
import { userFactory } from '@registry:tests/factories/user';
import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { GenOldTFASevice } from '../genTFACode.old.service';
import { InMemoryOTP } from '@registry:tests/inMemoryDatabase/otp';

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
