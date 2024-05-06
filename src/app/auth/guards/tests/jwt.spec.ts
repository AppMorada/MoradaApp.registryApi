import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { JwtGuard } from '../jwt.guard';
import { InMemoryUserRead } from '@tests/inMemoryDatabase/user/read';
import { JwtService } from '@nestjs/jwt';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { userFactory } from '@tests/factories/user';
import { GuardErrors } from '@app/errors/guard';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '@app/services/key/getKey.service';
import { ValidateTokenService } from '@app/services/login/validateToken.service';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { Key } from '@app/entities/key';
import { KeysEnum } from '@app/repositories/key';
import { randomBytes } from 'crypto';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Jwt guard test', () => {
	let jwtService: JwtService;
	let createTokenService: CreateTokenService;
	let getKeyService: GetKeyService;
	let validateTokenService: ValidateTokenService;

	let inMemoryContainer: InMemoryContainer;
	let readUserRepo: InMemoryUserRead;
	let keyRepo: InMemoryKey;

	let jwtGuard: JwtGuard;

	const uniqueRegistry = uniqueRegistryFactory();
	const user = userFactory({
		uniqueRegistryId: uniqueRegistry.id.value,
	});

	beforeEach(async () => {
		inMemoryContainer = new InMemoryContainer();
		readUserRepo = new InMemoryUserRead();
		keyRepo = new InMemoryKey(inMemoryContainer);

		jwtService = new JwtService();
		getKeyService = new GetKeyService(keyRepo);
		createTokenService = new CreateTokenService(jwtService, getKeyService);
		validateTokenService = new ValidateTokenService(
			jwtService,
			getKeyService,
		);

		jwtGuard = new JwtGuard(readUserRepo, validateTokenService);

		const accessTokenKey = new Key({
			name: KeysEnum.ACCESS_TOKEN_KEY,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: Date.now(),
			},
			ttl: 1000 * 60 * 60,
		});

		const refreshTokenKey = new Key({
			name: KeysEnum.REFRESH_TOKEN_KEY,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: Date.now(),
			},
			ttl: 1000 * 60 * 60,
		});

		await keyRepo.create(accessTokenKey);
		await keyRepo.create(refreshTokenKey);

		InMemoryUserRead.prototype.exec = jest.fn(async () => {
			++readUserRepo.calls.exec;
			return { user, uniqueRegistry };
		});
	});

	it('should be able to validate jwt guard', async () => {
		const tokens = await createTokenService.exec({ user, uniqueRegistry });

		const context = createMockExecutionContext({
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(jwtGuard.canActivate(context)).resolves.toBeTruthy();

		expect(readUserRepo.calls.exec).toEqual(1);
	});

	it('should throw one error - empty token', async () => {
		const context = createMockExecutionContext({});
		await expect(jwtGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({ message: 'Token não encontrado' }),
		);
	});

	it('should throw one error - malformed token', async () => {
		const context = createMockExecutionContext({
			headers: {
				authorization: 'Bearer malformedtoken',
			},
		});
		await expect(jwtGuard.canActivate(context)).rejects.toThrow(
			new ServiceErrors({
				message: 'O token precisa ter os campos "iat" e "exp"',
				tag: ServiceErrorsTags.unauthorized,
			}),
		);
	});
});
