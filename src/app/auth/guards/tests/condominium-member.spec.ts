import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryUserReadOps } from '@tests/inMemoryDatabase/user/read';
import { JwtService } from '@nestjs/jwt';
import { createMockExecutionContext } from '@tests/guards/executionContextSpy';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { userFactory } from '@tests/factories/user';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum } from '@app/entities/entities';
import { GuardErrors } from '@app/errors/guard';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '@app/services/key/getKey.service';
import { ValidateTokenService } from '@app/services/login/validateToken.service';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { Key } from '@app/entities/key';
import { KeysEnum } from '@app/repositories/key';
import { randomBytes } from 'crypto';
import { CondominiumMemberGuard } from '../condominium-member.guard';
import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumReadOps } from '@tests/inMemoryDatabase/condominium/read';
import { UUID } from '@app/entities/VO';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { InMemoryCommunityMembersReadOps } from '@tests/inMemoryDatabase/communityMember/read';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { InMemoryCondominiumWriteOps } from '@tests/inMemoryDatabase/condominium/write';
import { InMemoryCommunityMembersWriteOps } from '@tests/inMemoryDatabase/communityMember/write';
import { communityInfosFactory } from '@tests/factories/communityInfos';
import { InMemoryUserWriteOps } from '@tests/inMemoryDatabase/user/write';

describe('Condominium Member Guard test', () => {
	let jwtService: JwtService;
	let createTokenService: CreateTokenService;
	let getKeyService: GetKeyService;
	let validateTokenService: ValidateTokenService;

	let inMemoryContainer: InMemoryContainer;

	let userRepoReadOps: InMemoryUserReadOps;
	let userRepoWriteOps: InMemoryUserWriteOps;

	let communityMemberRepoReadOps: InMemoryCommunityMembersReadOps;
	let communityMemberRepoWriteOps: InMemoryCommunityMembersWriteOps;
	let condominiumRepoReadOps: InMemoryCondominiumReadOps;
	let condominiumRepoWriteOps: InMemoryCondominiumWriteOps;

	let keyRepo: InMemoryKey;

	let sut: CondominiumMemberGuard;

	beforeEach(async () => {
		inMemoryContainer = new InMemoryContainer();

		userRepoReadOps = new InMemoryUserReadOps(inMemoryContainer);
		userRepoWriteOps = new InMemoryUserWriteOps(inMemoryContainer);

		keyRepo = new InMemoryKey(inMemoryContainer);

		communityMemberRepoReadOps = new InMemoryCommunityMembersReadOps(
			inMemoryContainer,
		);
		communityMemberRepoWriteOps = new InMemoryCommunityMembersWriteOps(
			inMemoryContainer,
		);

		condominiumRepoReadOps = new InMemoryCondominiumReadOps(
			inMemoryContainer,
		);
		condominiumRepoWriteOps = new InMemoryCondominiumWriteOps(
			inMemoryContainer,
		);

		jwtService = new JwtService();
		getKeyService = new GetKeyService(keyRepo);
		createTokenService = new CreateTokenService(jwtService, getKeyService);
		validateTokenService = new ValidateTokenService(
			jwtService,
			getKeyService,
		);

		sut = new CondominiumMemberGuard(
			validateTokenService,
			userRepoReadOps,
			communityMemberRepoReadOps,
			condominiumRepoReadOps,
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

	it('should be able to validate condominium member', async () => {
		const owner = userFactory();
		const condominium = condominiumFactory({ ownerId: owner.id.value });
		await condominiumRepoWriteOps.create({
			condominium,
			user: owner,
		});

		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const member = condominiumMemberFactory({
			userId: user.id.value,
			condominiumId: condominium.id.value,
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		const communityInfos = communityInfosFactory({
			memberId: member.id.value,
		});

		userRepoWriteOps.create({ user, uniqueRegistry });
		communityMemberRepoWriteOps.createMany({
			members: [
				{
					content: member,
					communityInfos,
					rawUniqueRegistry: {
						email: uniqueRegistry.email!,
					},
				},
			],
		});

		const tokens = await createTokenService.exec({ user, uniqueRegistry });

		const context = createMockExecutionContext({
			params: {
				condominiumId: condominium.id.value,
			},
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(sut.canActivate(context)).resolves.toBeTruthy();

		expect(userRepoReadOps.calls.find).toEqual(1);
		expect(
			communityMemberRepoReadOps.calls.getByUserAndCondominiumId,
		).toEqual(1);
		expect(condominiumRepoReadOps.calls.find).toEqual(1);
	});

	it('should throw one error - user doesn\'t exists', async () => {
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

		await expect(sut.canActivate(context)).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User not found',
			}),
		);

		expect(userRepoReadOps.calls.find).toEqual(1);
	});

	it('should throw one error - condominium doesn\'t exists', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		userRepoWriteOps.create({ uniqueRegistry, user });

		const tokens = await createTokenService.exec({ user, uniqueRegistry });

		const context = createMockExecutionContext({
			params: {
				condominiumId: UUID.genV4().value,
			},
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(sut.canActivate(context)).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'Condominium not found',
			}),
		);

		expect(userRepoReadOps.calls.find).toEqual(1);
		expect(condominiumRepoReadOps.calls.find).toEqual(1);
	});

	it('should throw one error - condominium member doesn\'t exists', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });
		const condominium = condominiumFactory({ ownerId: user.id.value });
		userRepoReadOps.uniqueRegistries.push(uniqueRegistry);
		userRepoReadOps.users.push(user);
		condominiumRepoReadOps.condominiums.push(condominium);

		const tokens = await createTokenService.exec({ user, uniqueRegistry });

		const context = createMockExecutionContext({
			params: {
				condominiumId: UUID.genV4().value,
			},
			headers: {
				authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		await expect(sut.canActivate(context)).rejects.toThrow(
			new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'Condominium not found',
			}),
		);

		expect(userRepoReadOps.calls.find).toEqual(1);
		expect(condominiumRepoReadOps.calls.find).toEqual(1);
	});

	it('should throw one error - empty token', async () => {
		const context = createMockExecutionContext({
			params: {
				condominiumId: UUID.genV4().value,
			},
		});
		await expect(sut.canActivate(context)).rejects.toThrow(
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
		await expect(sut.canActivate(context)).rejects.toThrow(
			new ServiceErrors({
				message: 'O token precisa ter os campos "iat" e "exp"',
				tag: ServiceErrorsTags.unauthorized,
			}),
		);
	});
});
