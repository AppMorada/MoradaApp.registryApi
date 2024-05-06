import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUserRead } from '@tests/inMemoryDatabase/user/read';
import { JwtService } from '@nestjs/jwt';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { userFactory } from '@tests/factories/user';
import { RefreshTokenGuard } from '../refreshToken.guard';
import { CookieAdapter } from '@app/adapters/cookie';
import { CookieParserAdapter } from '@app/adapters/cookie-parser/cookieParserAdapter';
import { GuardErrors } from '@app/errors/guard';
import { TokenType } from '@app/auth/tokenTypes';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '@app/services/key/getKey.service';
import { ValidateTokenService } from '@app/services/login/validateToken.service';
import { Key } from '@app/entities/key';
import { KeysEnum } from '@app/repositories/key';
import { randomBytes } from 'crypto';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { LoggerSpy } from '@tests/adapters/logger.spy';
import { GetEnvService } from '@infra/configs/env/getEnv.service';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Refresh token guard test', () => {
	let jwtService: JwtService;
	let getKeyService: GetKeyService;
	let createTokenService: CreateTokenService;
	let validateTokenService: ValidateTokenService;
	let getEnvService: GetEnvService;

	let refreshTokenGuard: RefreshTokenGuard;

	let loggerAdapter: LoggerSpy;
	let cookieAdapter: CookieAdapter;

	let inMemoryContainer: InMemoryContainer;
	let readUserRepo: InMemoryUserRead;
	let keyRepo: InMemoryKey;

	const uniqueRegistry = uniqueRegistryFactory();
	const user = userFactory({
		uniqueRegistryId: uniqueRegistry.id.value,
	});

	beforeEach(async () => {
		cookieAdapter = new CookieParserAdapter();
		loggerAdapter = new LoggerSpy();

		readUserRepo = new InMemoryUserRead();

		inMemoryContainer = new InMemoryContainer();
		keyRepo = new InMemoryKey(inMemoryContainer);

		jwtService = new JwtService();
		getKeyService = new GetKeyService(keyRepo);
		validateTokenService = new ValidateTokenService(
			jwtService,
			getKeyService,
		);
		createTokenService = new CreateTokenService(jwtService, getKeyService);
		getEnvService = new GetEnvService(loggerAdapter);

		refreshTokenGuard = new RefreshTokenGuard(
			cookieAdapter,
			validateTokenService,
			readUserRepo,
			getEnvService,
		);

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

	it('should be able to validate refresh token guard', async () => {
		const tokens = await createTokenService.exec({ user, uniqueRegistry });

		const context = createMockExecutionContext({
			headers: {
				cookie: `refresh-token=${tokens.refreshToken}`,
			},
		});

		await expect(
			refreshTokenGuard.canActivate(context),
		).resolves.toBeTruthy();

		expect(readUserRepo.calls.exec).toEqual(1);
	});

	it('should throw one error - wrong cookie', async () => {
		const context = createMockExecutionContext({
			headers: {
				cookie: 'refresh-token=wrongcookie',
			},
		});

		await expect(refreshTokenGuard.canActivate(context)).rejects.toThrow(
			new ServiceErrors({
				message: 'O token precisa ter os campos "iat" e "exp"',
				tag: ServiceErrorsTags.unauthorized,
			}),
		);
		expect(readUserRepo.calls.exec).toEqual(0);
	});

	it('should throw one error - should provide cookies', async () => {
		const context = createMockExecutionContext({
			headers: {},
		});

		await expect(refreshTokenGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: `Nenhum token do tipo ${TokenType.refreshToken} foi encontrado`,
			}),
		);

		expect(readUserRepo.calls.exec).toEqual(0);
	});
});
