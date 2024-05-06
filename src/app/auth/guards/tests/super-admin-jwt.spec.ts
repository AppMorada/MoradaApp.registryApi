import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUserRead } from '@tests/inMemoryDatabase/user/read';
import { JwtService } from '@nestjs/jwt';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { userFactory } from '@tests/factories/user';
import { GuardErrors } from '@app/errors/guard';
import { UUID } from '@app/entities/VO';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { SuperAdminJwt } from '../super-admin-jwt.guard';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '@app/services/key/getKey.service';
import { ValidateTokenService } from '@app/services/login/validateToken.service';
import { Key } from '@app/entities/key';
import { KeysEnum } from '@app/repositories/key';
import { randomBytes } from 'crypto';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { InMemoryCondominiumSearch } from '@tests/inMemoryDatabase/condominium/read/find';
import { condominiumFactory } from '@tests/factories/condominium';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Super Admin Jwt guard test', () => {
	let jwtService: JwtService;
	let createTokenService: CreateTokenService;
	let getKeyService: GetKeyService;
	let validateTokenService: ValidateTokenService;
	let adminJwtGuard: SuperAdminJwt;

	let inMemoryContainer: InMemoryContainer;
	let readUserRepo: InMemoryUserRead;
	let readCondominiumRepo: InMemoryCondominiumSearch;
	let keyRepo: InMemoryKey;

	const user = userFactory();
	const condominium = condominiumFactory({ ownerId: user.id.value });
	const uniqueRegistry = uniqueRegistryFactory();

	beforeEach(async () => {
		inMemoryContainer = new InMemoryContainer();
		readUserRepo = new InMemoryUserRead();
		keyRepo = new InMemoryKey(inMemoryContainer);
		readCondominiumRepo = new InMemoryCondominiumSearch();

		jwtService = new JwtService();
		getKeyService = new GetKeyService(keyRepo);
		createTokenService = new CreateTokenService(jwtService, getKeyService);

		validateTokenService = new ValidateTokenService(
			jwtService,
			getKeyService,
		);

		adminJwtGuard = new SuperAdminJwt(
			validateTokenService,
			readUserRepo,
			readCondominiumRepo,
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
		InMemoryCondominiumSearch.prototype.exec = jest.fn(async () => {
			++readCondominiumRepo.calls.exec;
			return condominium;
		});
	});

	it('should be able to validate admin jwt guard', async () => {
		const tokens = await createTokenService.exec({ user, uniqueRegistry });

		const context = createMockExecutionContext({
			params: {
				condominiumId: UUID.genV4().value,
			},
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(adminJwtGuard.canActivate(context)).resolves.toBeTruthy();

		expect(readUserRepo.calls.exec).toEqual(1);
		expect(readCondominiumRepo.calls.exec).toEqual(1);
	});

	it('should throw one error - user doesn\'t have permission', async () => {
		const tokens = await createTokenService.exec({ user, uniqueRegistry });

		InMemoryCondominiumSearch.prototype.exec = jest.fn(async () => {
			++readCondominiumRepo.calls.exec;
			const anotherCondomnium = condominiumFactory();
			return anotherCondomnium;
		});

		const context = createMockExecutionContext({
			params: {
				condominiumId: UUID.genV4().value,
			},
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(adminJwtGuard.canActivate(context)).rejects.toThrow(
			new GuardErrors({
				message: 'Usuário não tem autorização para realizar tal ação',
			}),
		);

		expect(readUserRepo.calls.exec).toEqual(1);
		expect(readCondominiumRepo.calls.exec).toEqual(1);
	});

	it('should throw one error - condominium should be provided', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const tokens = await createTokenService.exec({ user, uniqueRegistry });

		const context = createMockExecutionContext({
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(adminJwtGuard.canActivate(context)).rejects.toThrow(
			new BadRequestException({
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'Bad Request',
				message: ['Condomínio não especificado'],
			}),
		);
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
				authorization: 'Bearer malformedtoken',
			},
		});
		await expect(adminJwtGuard.canActivate(context)).rejects.toThrow(
			new ServiceErrors({
				message: 'O token precisa ter os campos "iat" e "exp"',
				tag: ServiceErrorsTags.unauthorized,
			}),
		);
	});
});
