import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
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
import { CondominiumMemberGuard } from '../condominium-member.guard';
import { condominiumFactory } from '@tests/factories/condominium';
import { InMemoryCondominiumSearch } from '@tests/inMemoryDatabase/condominium/read/find';
import { UUID } from '@app/entities/VO';
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { InMemoryCommunityMembersGetByUserAndCondominiumId } from '@tests/inMemoryDatabase/communityMember/read/getByUserIdAndCondominiumId';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { communityInfosFactory } from '@tests/factories/communityInfos';

describe('Condominium Member Guard test', () => {
	let jwtService: JwtService;
	let createTokenService: CreateTokenService;
	let getKeyService: GetKeyService;
	let validateTokenService: ValidateTokenService;

	let inMemoryContainer: InMemoryContainer;

	let readUserRepo: InMemoryUserRead;
	let readCommunityMemberRepo: InMemoryCommunityMembersGetByUserAndCondominiumId;
	let readCondominiumRepo: InMemoryCondominiumSearch;

	let keyRepo: InMemoryKey;

	let sut: CondominiumMemberGuard;

	const user = userFactory();
	const condominium = condominiumFactory();
	const member = condominiumMemberFactory({
		role: 0,
		userId: user.id.value,
		condominiumId: condominium.id.value,
	});
	const communityInfos = communityInfosFactory({ memberId: member.id.value });
	const uniqueRegistry = uniqueRegistryFactory();

	beforeEach(async () => {
		inMemoryContainer = new InMemoryContainer();

		keyRepo = new InMemoryKey(inMemoryContainer);

		readUserRepo = new InMemoryUserRead();
		readCommunityMemberRepo =
			new InMemoryCommunityMembersGetByUserAndCondominiumId();
		readCondominiumRepo = new InMemoryCondominiumSearch();

		jwtService = new JwtService();
		getKeyService = new GetKeyService(keyRepo);
		createTokenService = new CreateTokenService(jwtService, getKeyService);
		validateTokenService = new ValidateTokenService(
			jwtService,
			getKeyService,
		);

		sut = new CondominiumMemberGuard(
			validateTokenService,
			readUserRepo,
			readCommunityMemberRepo,
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
		InMemoryCommunityMembersGetByUserAndCondominiumId.prototype.exec =
			jest.fn(async () => {
				++readCommunityMemberRepo.calls.exec;
				return { member, communityInfos };
			});
	});

	it('should be able to validate condominium member', async () => {
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

		expect(readUserRepo.calls.exec).toEqual(1);
		expect(readCommunityMemberRepo.calls.exec).toEqual(1);
		expect(readCondominiumRepo.calls.exec).toEqual(1);
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
