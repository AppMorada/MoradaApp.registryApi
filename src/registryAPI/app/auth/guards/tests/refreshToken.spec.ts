import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@registry:tests/inMemoryDatabase/user';
import { JwtService } from '@nestjs/jwt';
import { createMockExecutionContext } from '@registry:tests/guards/executionContextSpy';
import { CreateTokenService } from '@registry:app/services/createToken.service';
import { userFactory } from '@registry:tests/factories/user';
import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';
import { RefreshTokenGuard } from '../refreshToken.guard';
import { CookieAdapter } from '@registry:app/adapters/cookie';
import { CookieParserAdapter } from '@registry:app/adapters/cookie-parser/cookieParserAdapter';
import { GuardErrors } from '@registry:app/errors/guard';
import { TokenType } from '@registry:app/auth/tokenTypes';

describe('Refresh token guard test', () => {
	let jwtService: JwtService;
	let createTokenService: CreateTokenService;
	let refreshTokenGuard: RefreshTokenGuard;
	let cookieAdapter: CookieAdapter;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;

	beforeEach(async () => {
		jwtService = new JwtService();
		cookieAdapter = new CookieParserAdapter();
		createTokenService = new CreateTokenService(jwtService);

		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);

		refreshTokenGuard = new RefreshTokenGuard(
			cookieAdapter,
			jwtService,
			userRepo,
		);
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
			new GuardErrors({
				message: `Dado armazenado no ${TokenType.refreshToken} é inválido`,
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
