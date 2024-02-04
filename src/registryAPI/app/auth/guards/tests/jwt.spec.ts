import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { JwtGuard } from '../jwt.guard';
import { InMemoryUser } from '@registry:tests/inMemoryDatabase/user';
import { JwtService } from '@nestjs/jwt';
import { createMockExecutionContext } from '@registry:tests/guards/executionContextSpy';
import { CreateTokenService } from '@registry:app/services/createToken.service';
import { userFactory } from '@registry:tests/factories/user';
import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';
import { InMemoryError } from '@registry:tests/errors/inMemoryError';
import { EntitiesEnum } from '@registry:app/entities/entities';
import { GuardErrors } from '@registry:app/errors/guard';

describe('Jwt guard test', () => {
	let jwtService: JwtService;
	let createTokenService: CreateTokenService;
	let jwtGuard: JwtGuard;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;

	beforeEach(async () => {
		jwtService = new JwtService();
		createTokenService = new CreateTokenService(jwtService);

		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);

		jwtGuard = new JwtGuard(jwtService, userRepo);
	});

	it('should be able to validate jwt guard', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory();
		await userRepo.create({ user, condominiumRelUser });

		const tokens = await createTokenService.exec({ user });

		const context = createMockExecutionContext({
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(jwtGuard.canActivate(context)).resolves.toBeTruthy();

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);
	});

	it('should throw one error - user doesn\'t exists', async () => {
		const user = userFactory();
		const tokens = await createTokenService.exec({ user });

		const context = createMockExecutionContext({
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(jwtGuard.canActivate(context)).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User not found',
			}),
		);

		expect(userRepo.calls.find).toEqual(1);
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
			new GuardErrors({ message: 'JWT inválido' }),
		);
	});
});
