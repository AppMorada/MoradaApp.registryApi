import { BcryptAdapter } from '@app/adapters/bcrypt/bcryptAdapter';
import { CryptAdapter } from '@app/adapters/crypt';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUserReadOps } from '@tests/inMemoryDatabase/user/read';
import { CheckTFACodeGuard } from '../checkTFACode.guard';
import { userFactory } from '@tests/factories/user';
import { generateStringCodeContentBasedOnUser } from '@utils/generateStringCodeContent';
import { User } from '@app/entities/user';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { GuardErrors } from '@app/errors/guard';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '@app/services/key/getKey.service';
import { ValidateTFAService } from '@app/services/login/validateTFA.service';
import { KeysEnum } from '@app/repositories/key';
import { Key } from '@app/entities/key';
import { randomBytes } from 'crypto';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { Reflector } from '@nestjs/core';

jest.mock('nodemailer');

describe('Check TFA Code guard test', () => {
	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUserReadOps;
	let keyRepo: InMemoryKey;
	let getKeyService: GetKeyService;
	let cryptAdapter: CryptAdapter;
	let validateTFAService: ValidateTFAService;

	let checkTFACodeGuard: CheckTFACodeGuard;

	async function genCode(
		user: User,
		uniqueRegistry: UniqueRegistry,
		key: Key,
	) {
		const code = generateStringCodeContentBasedOnUser({
			user,
			uniqueRegistry,
		});

		const metadata = JSON.stringify({
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor((Date.now() + 1000 * 60 * 60 * 3) / 1000),
			sub: uniqueRegistry.email.value,
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
		userRepo = new InMemoryUserReadOps(inMemoryContainer);
		keyRepo = new InMemoryKey(inMemoryContainer);

		getKeyService = new GetKeyService(keyRepo);
		cryptAdapter = new BcryptAdapter();

		validateTFAService = new ValidateTFAService(
			getKeyService,
			cryptAdapter,
		);

		const reflector = new Reflector();
		checkTFACodeGuard = new CheckTFACodeGuard(
			userRepo,
			validateTFAService,
			reflector,
		);

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
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });

		userRepo.uniqueRegistries.push(uniqueRegistry);
		userRepo.users.push(user);

		const key = await keyRepo.getSignature(KeysEnum.TFA_TOKEN_KEY);

		const code = await genCode(user, uniqueRegistry, key);
		const context = createMockExecutionContext({
			headers: {
				authorization: `Bearer ${code}`,
			},
			body: {
				email: uniqueRegistry.email.value,
			},
		});

		await expect(
			checkTFACodeGuard.canActivate(context),
		).resolves.toBeTruthy();

		expect(userRepo.calls.find).toEqual(1);
	});

	it('should throw one error - invalid code', async () => {
		const context = createMockExecutionContext({});

		await expect(checkTFACodeGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'O código é inválido',
			}),
		);

		expect(userRepo.calls.find).toEqual(0);
	});

	it('should throw one error - invalid code', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });

		userRepo.uniqueRegistries.push(uniqueRegistry);
		userRepo.users.push(user);

		const context = createMockExecutionContext({
			headers: {
				authorization: `Bearer ${btoa(
					JSON.stringify({ msg: 'wrong' }),
				)}.${btoa(JSON.stringify({ msg: 'token' }))}`,
			},
			body: {
				email: uniqueRegistry.email.value,
			},
		});

		await expect(checkTFACodeGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'Código de dois fatores não contém o campo "sub"',
			}),
		);

		expect(userRepo.calls.find).toEqual(0);
	});
});
