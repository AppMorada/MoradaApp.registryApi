import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { JwtService } from '@nestjs/jwt';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { userFactory } from '@tests/factories/user';
import { GuardErrors } from '@app/errors/guard';
import { UUID } from '@app/entities/VO';
import { AdminJwt } from '../admin-jwt.guard';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { ValidateTokenService } from '@app/services/login/validateToken.service';
import { GetKeyService } from '@app/services/key/getKey.service';
import { Key } from '@app/entities/key';
import { KeysEnum } from '@app/repositories/key';
import { randomBytes } from 'crypto';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { condominiumFactory } from '@tests/factories/condominium';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { InMemoryUserRead } from '@tests/inMemoryDatabase/user/read';
import { InMemoryCondominiumSearch } from '@tests/inMemoryDatabase/condominium/read/find';
import { InMemoryEmployeeMembersGetByUserId } from '@tests/inMemoryDatabase/employeeMember/read/getByUserId';
import { EmployeeMemberRepoReadOpsInterfaces } from '@app/repositories/employeeMember/read';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';

describe('Admin Jwt guard test', () => {
	let jwtService: JwtService;
	let createTokenService: CreateTokenService;
	let validateTokenService: ValidateTokenService;
	let getKeyService: GetKeyService;
	let adminJwtGuard: AdminJwt;

	let inMemoryContainer: InMemoryContainer;
	let readUserRepo: InMemoryUserRead;
	let readMemberRepo: InMemoryEmployeeMembersGetByUserId;
	let readCondominiumRepo: InMemoryCondominiumSearch;
	let keyRepo: InMemoryKey;

	const condominiumId = UUID.genV4().value;

	beforeEach(async () => {
		jwtService = new JwtService();
		inMemoryContainer = new InMemoryContainer();
		readUserRepo = new InMemoryUserRead();
		keyRepo = new InMemoryKey(inMemoryContainer);
		readCondominiumRepo = new InMemoryCondominiumSearch();
		readMemberRepo = new InMemoryEmployeeMembersGetByUserId();

		getKeyService = new GetKeyService(keyRepo);
		createTokenService = new CreateTokenService(jwtService, getKeyService);

		validateTokenService = new ValidateTokenService(
			jwtService,
			getKeyService,
		);
		adminJwtGuard = new AdminJwt(
			validateTokenService,
			readUserRepo,
			readMemberRepo,
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

		const user = userFactory();
		const condominium = condominiumFactory({}, condominiumId);
		const member = condominiumMemberFactory({
			role: 1,
			userId: user.id.value,
			condominiumId: condominium.id.value,
		});
		const uniqueRegistry = uniqueRegistryFactory();

		InMemoryUserRead.prototype.exec = jest.fn(async () => {
			++readUserRepo.calls.exec;
			return { user, uniqueRegistry };
		});
		InMemoryCondominiumSearch.prototype.exec = jest.fn(async () => {
			++readCondominiumRepo.calls.exec;
			return condominium;
		});
		InMemoryEmployeeMembersGetByUserId.prototype.exec = jest.fn(
			async () => {
				++readMemberRepo.calls.exec;

				const returnableMember: EmployeeMemberRepoReadOpsInterfaces.performantCondominiumMember =
					{
						id: member.id.value,
						condominiumId: member.condominiumId.value,
						role: member.role.value,
						updatedAt: member.updatedAt,
						createdAt: member.createdAt,
					};

				const returnableUser: EmployeeMemberRepoReadOpsInterfaces.performantUser =
					{
						id: user.id.value,
						name: user.name.value,
						phoneNumber: user.phoneNumber?.value,
						tfa: user.tfa,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
					};

				return {
					worksOn: [returnableMember],
					uniqueRegistry: UniqueRegistryMapper.toObject(
						uniqueRegistryFactory(),
					),
					user: returnableUser,
				};
			},
		);
	});

	it('should be able to validate admin jwt guard', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const tokens = await createTokenService.exec({ user, uniqueRegistry });

		const context = createMockExecutionContext({
			params: {
				condominiumId: condominiumId,
			},
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(adminJwtGuard.canActivate(context)).resolves.toBeTruthy();

		expect(readUserRepo.calls.exec).toEqual(1);
		expect(readMemberRepo.calls.exec).toEqual(1);
	});

	it('should throw one error - user doesn\'t have permission', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const tokens = await createTokenService.exec({ user, uniqueRegistry });

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
		expect(readMemberRepo.calls.exec).toEqual(1);
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
				message: 'Condomínio não especificado',
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
