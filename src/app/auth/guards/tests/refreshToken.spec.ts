import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@tests/inMemoryDatabase/user';
import { JwtService } from '@nestjs/jwt';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { CreateTokenService } from '@app/services/createToken.service';
import { userFactory } from '@tests/factories/user';
import { condominiumRelUserFactory } from '@tests/factories/condominiumRelUser';
import { RefreshTokenGuard } from '../refreshToken.guard';
import { CookieAdapter } from '@app/adapters/cookie';
import { CookieParserAdapter } from '@app/adapters/cookie-parser/cookieParserAdapter';
import { GuardErrors } from '@app/errors/guard';
import { TokenType } from '@app/auth/tokenTypes';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '@app/services/getKey.service';
import { ValidateTokenService } from '@app/services/validateToken.service';
import { Key } from '@app/entities/key';
import { KeysEnum } from '@app/repositories/key';
import { randomBytes } from 'crypto';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { LoggerSpy } from '@tests/adapters/logger.spy';
import { GetEnvService } from '@infra/configs/getEnv.service';
import { InMemorySecret } from '@tests/inMemoryDatabase/secret';

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
	let userRepo: InMemoryUser;
	let keyRepo: InMemoryKey;
	let secretRepo: InMemorySecret;

	beforeEach(async () => {
		cookieAdapter = new CookieParserAdapter();
		loggerAdapter = new LoggerSpy();

		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);
		keyRepo = new InMemoryKey(inMemoryContainer);
		secretRepo = new InMemorySecret(inMemoryContainer);

		jwtService = new JwtService();
		getKeyService = new GetKeyService(keyRepo);
		validateTokenService = new ValidateTokenService(
			jwtService,
			getKeyService,
		);
		createTokenService = new CreateTokenService(jwtService, getKeyService);
		getEnvService = new GetEnvService(loggerAdapter, secretRepo);

		refreshTokenGuard = new RefreshTokenGuard(
			cookieAdapter,
			validateTokenService,
			userRepo,
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
	});

	it('should be able to validate refresh token guard', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		await userRepo.create({ user, condominiumRelUser });

		const tokens = await createTokenService.exec({ user });

		const context = createMockExecutionContext({
			headers: {
				cookie: `refresh-token=${tokens.refreshToken}`,
			},
		});

		await expect(
			refreshTokenGuard.canActivate(context),
		).resolves.toBeTruthy();

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);
	});

	it('should throw one error - wrong cookie', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		await userRepo.create({ user, condominiumRelUser });

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
		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(0);
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

		expect(userRepo.calls.create).toEqual(0);
		expect(userRepo.calls.find).toEqual(0);
	});
});
