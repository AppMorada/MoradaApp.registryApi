import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { CryptAdapter } from '@app/adapters/crypt';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { CheckTFACodeGuard } from '../checkTFACode.guard';
import { userFactory } from '@tests/factories/user';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';
import { generateStringCodeContent } from '@utils/generateStringCodeContent';
import { User } from '@app/entities/user';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { GuardErrors } from '@app/errors/guard';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '@app/services/getKey.service';
import { ValidateTFAService } from '@app/services/validateTFA.service';
import { KeysEnum } from '@app/repositories/key';
import { Key } from '@app/entities/key';
import { randomBytes } from 'crypto';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';

jest.mock('nodemailer');

describe('Check TFA Code guard test', () => {
	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;
	let keyRepo: InMemoryKey;
	let getKeyService: GetKeyService;
	let cryptAdapter: CryptAdapter;
	let validateTFAService: ValidateTFAService;

	let checkTFACodeGuard: CheckTFACodeGuard;

	async function genCode(user: User, key: Key) {
		const code = generateStringCodeContent({
			email: user.email,
			id: user.id,
		});

		const metadata = JSON.stringify({
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor((Date.now() + 1000 * 60 * 60 * 3) / 1000),
		});
		const hash = encodeURIComponent(
			`${btoa(metadata)}.${btoa(code)}`.replaceAll('=', ''),
		);

		const inviteSignature = await cryptAdapter.hashWithHmac({
			data: hash,
			key: key.actual.content,
		});
		return encodeURIComponent(
			`${btoa(metadata)}.${btoa(inviteSignature)}`.replaceAll('=', ''),
		);
	}

	beforeEach(async () => {
		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);
		keyRepo = new InMemoryKey(inMemoryContainer);

		getKeyService = new GetKeyService(keyRepo);
		cryptAdapter = new BcryptAdapter();

		validateTFAService = new ValidateTFAService(
			getKeyService,
			cryptAdapter,
		);

		checkTFACodeGuard = new CheckTFACodeGuard(userRepo, validateTFAService);

		const tfaKey = new Key({
			name: KeysEnum.TFA_TOKEN_KEY,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: Date.now(),
			},
			ttl: 1000 * 60 * 60,
		});

		await keyRepo.create(tfaKey);
	});

	it('should be able to validate the CheckTFACodeGuard', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		await userRepo.create({ user, condominiumRelUser });
		const key = await keyRepo.getSignature(KeysEnum.TFA_TOKEN_KEY);

		const code = await genCode(user, key);
		const context = createMockExecutionContext({
			headers: {
				authorization: `Bearer ${code}`,
			},
			body: {
				email: user.email.value,
			},
		});

		await expect(
			checkTFACodeGuard.canActivate(context),
		).resolves.toBeTruthy();

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);
	});

	it('should throw one error - invalid code', async () => {
		const context = createMockExecutionContext({});

		await expect(checkTFACodeGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'O código é inválido',
			}),
		);

		expect(userRepo.calls.create).toEqual(0);
		expect(userRepo.calls.find).toEqual(0);
	});

	it('should throw one error - invalid code', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		await userRepo.create({ user, condominiumRelUser });

		const context = createMockExecutionContext({
			headers: {
				authorization: `Bearer ${btoa(
					JSON.stringify({ msg: 'wrong' }),
				)}.${btoa(JSON.stringify({ msg: 'token' }))}`,
			},
			body: {
				email: user.email.value,
			},
		});

		await expect(checkTFACodeGuard.canActivate(context)).rejects.toThrow(
			new ServiceErrors({
				message:
					'O código de autenticação de dois fatores precisa ter os campos "iat" e "exp"',
				tag: ServiceErrorsTags.unauthorized,
			}),
		);

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);
	});
});
