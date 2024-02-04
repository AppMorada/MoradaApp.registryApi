import { InMemoryContainer } from '@registry:tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUser } from '@registry:tests/inMemoryDatabase/user';
import { JwtService } from '@nestjs/jwt';
import { createMockExecutionContext } from '@registry:tests/guards/executionContextSpy';
import { CreateTokenService } from '@registry:app/services/createToken.service';
import { userFactory } from '@registry:tests/factories/user';
import { condominiumRelUserFactory } from '@registry:tests/factories/condominiumRelUser';
import { InMemoryError } from '@registry:tests/errors/inMemoryError';
import { EntitiesEnum } from '@registry:app/entities/entities';
import { GuardErrors } from '@registry:app/errors/guard';
import { UUID } from '@registry:app/entities/VO';
import { AdminJwt } from '../admin-jwt.guard';
import { BadRequestException, HttpStatus } from '@nestjs/common';

describe('Admin Jwt guard test', () => {
	let jwtService: JwtService;
	let createTokenService: CreateTokenService;
	let adminJwtGuard: AdminJwt;

	let inMemoryContainer: InMemoryContainer;
	let userRepo: InMemoryUser;

	beforeEach(async () => {
		jwtService = new JwtService();
		createTokenService = new CreateTokenService(jwtService);

		inMemoryContainer = new InMemoryContainer();
		userRepo = new InMemoryUser(inMemoryContainer);

		adminJwtGuard = new AdminJwt(jwtService, userRepo);
	});

	it('should be able to validate admin jwt guard', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory({
			level: 1,
		});
		await userRepo.create({ user, condominiumRelUser });

		const tokens = await createTokenService.exec({ user });

		const context = createMockExecutionContext({
			params: {
				condominiumId: condominiumRelUser.condominiumId.value,
			},
			headers: {
				'user-token': `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(adminJwtGuard.canActivate(context)).resolves.toBeTruthy();

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);
		expect(userRepo.calls.getCondominiumRelation).toEqual(1);
	});

	it('should throw one error - user doesn\'t have permission', async () => {
		const user = userFactory();
		const condominiumRelUser = condominiumRelUserFactory({
			level: 0,
		});
		await userRepo.create({ user, condominiumRelUser });

		const tokens = await createTokenService.exec({ user });

		const context = createMockExecutionContext({
			params: {
				condominiumId: condominiumRelUser.condominiumId.value,
			},
			headers: {
				'user-token': `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(adminJwtGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'Usuário não tem autorização para realizar tal ação',
			}),
		);

		expect(userRepo.calls.create).toEqual(1);
		expect(userRepo.calls.find).toEqual(1);
		expect(userRepo.calls.getCondominiumRelation).toEqual(1);
	});

	it('should throw one error - condominium should be provided', async () => {
		const user = userFactory();
		const tokens = await createTokenService.exec({ user });

		const context = createMockExecutionContext({
			headers: {
				'user-token': `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(adminJwtGuard.canActivate(context)).rejects.toThrow(
			new BadRequestException({
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'Bad Request',
				message: 'Condomínio não especificado',
			}),
		);
	});

	it('should throw one error - user doesn\'t exists', async () => {
		const user = userFactory();
		const tokens = await createTokenService.exec({ user });

		const context = createMockExecutionContext({
			params: {
				condominiumId: UUID.genV4().value,
			},
			headers: {
				'user-token': `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(adminJwtGuard.canActivate(context)).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User not found',
			}),
		);

		expect(userRepo.calls.find).toEqual(1);
	});

	it('should throw one error - empty token', async () => {
		const context = createMockExecutionContext({
			params: {
				condominiumId: UUID.genV4().value,
			},
		});
		await expect(adminJwtGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({ message: 'Token não encontrado' }),
		);
	});

	it('should throw one error - malformed token', async () => {
		const context = createMockExecutionContext({
			params: {
				condominiumId: UUID.genV4().value,
			},
			headers: {
				'user-token': 'Bearer malformedtoken',
			},
		});
		await expect(adminJwtGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({ message: 'JWT inválido' }),
		);
	});
});
