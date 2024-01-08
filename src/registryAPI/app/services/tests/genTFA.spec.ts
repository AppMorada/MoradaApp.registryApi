import { CryptSpy } from '@registry:tests/adapters/cryptSpy';
import { EmailSpy } from '@registry:tests/adapters/emailSpy';
import { GenTFAService } from '../genTFA.service';
import { userFactory } from '@registry:tests/factories/user';
import { InMemoryUser } from '@registry:tests/inMemoryDatabase/user';
import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';

describe('Gen TFA Service', () => {
	let genTFA: GenTFAService;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;
	let emailAdapter: EmailSpy;
	let cryptAdapter: CryptSpy;

	beforeEach(() => {
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);
		emailAdapter = new EmailSpy();
		cryptAdapter = new CryptSpy();

		genTFA = new GenTFAService(emailAdapter, userRepo, cryptAdapter);
	});

	it('should be able to gen a TFA', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();

		await userRepo.create({ user, condominiumRelUser });

		await genTFA.exec({
			email: user.email,
			userId: user.id,
		});

		expect(userRepo.calls.create).toEqual(1);
		expect(cryptAdapter.calls.hashWithHmac).toEqual(1);
		expect(emailAdapter.calls.send).toEqual(1);
	});
});
