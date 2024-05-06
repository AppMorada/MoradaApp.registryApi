import { JwtService } from '@nestjs/jwt';
import { CreateTokenService } from '../../login/createToken.service';
import { userFactory } from '@tests/factories/user';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '../../key/getKey.service';
import { Key } from '@app/entities/key';
import { KeysEnum } from '@app/repositories/key';
import { randomBytes } from 'crypto';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Create token test', () => {
	let sut: CreateTokenService;
	let getKey: GetKeyService;
	let tokenService: JwtService;

	let inMemoryContainer: InMemoryContainer;
	let keyRepo: InMemoryKey;

	beforeEach(async () => {
		inMemoryContainer = new InMemoryContainer();
		keyRepo = new InMemoryKey(inMemoryContainer);
		tokenService = new JwtService();

		getKey = new GetKeyService(keyRepo);
		sut = new CreateTokenService(tokenService, getKey);

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

	it('should be able to create token', async () => {
		const uniqueRegistry = uniqueRegistryFactory();
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });

		const accessKey = await keyRepo.getSignature(KeysEnum.ACCESS_TOKEN_KEY);
		const refreshKey = await keyRepo.getSignature(
			KeysEnum.REFRESH_TOKEN_KEY,
		);

		const { accessToken, refreshToken } = await sut.exec({
			user,
			uniqueRegistry,
		});

		await tokenService.verify(accessToken, {
			secret: accessKey.actual.content,
		});
		await tokenService.verify(refreshToken, {
			secret: refreshKey.actual.content,
		});

		expect(keyRepo.calls.getSignature).toEqual(4);
	});
});
