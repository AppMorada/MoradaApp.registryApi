import { JwtService } from '@nestjs/jwt';
import { InMemoryContainer } from '@tests/inMemoryDatabase/inMemoryContainer';
import { InMemoryKey } from '@tests/inMemoryDatabase/key';
import { GetKeyService } from '../../key/getKey.service';
import { ValidateTokenService } from '../../login/validateToken.service';
import { Key } from '@app/entities/key';
import { KeysEnum } from '@app/repositories/key';
import { randomBytes } from 'crypto';
import { tokenFactory } from '@tests/factories/token';
import { JwtServiceMock } from '@tests/services/jwtService';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';

describe('ValidateTokenService Service', () => {
	let container: InMemoryContainer;
	let keyRepo: InMemoryKey;
	let jwtService: JwtService;
	let getKey: GetKeyService;
	let sut: ValidateTokenService;

	beforeEach(() => {
		container = new InMemoryContainer();
		keyRepo = new InMemoryKey(container);

		JwtService.prototype.verifyAsync = jest.fn(JwtServiceMock.verifyAsync);
		jwtService = new JwtService();

		getKey = new GetKeyService(keyRepo);
		sut = new ValidateTokenService(jwtService, getKey);
	});

	it('should validate the token and return sigState as \'OK\'', async () => {
		const case1 = async () => {
			// Testando o token mais novo possível e que usa a assinatura mais nova
			const iat = Date.now();
			const key = new Key({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				ttl: 1000 * 60 * 60,
				actual: {
					content: randomBytes(100).toString('hex'),
					buildedAt: iat,
				},
			});
			await keyRepo.create(key);

			const token = tokenFactory({
				body: {
					data: 'any',
					iat: Math.floor(iat / 1000),
					exp: Math.floor(key.renewTime / 1000),
				},
				signature: key.actual.content,
			});

			const { sigState } = await sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			});
			expect(sigState === 'OK').toEqual(true);
			expect(keyRepo.calls.create).toEqual(1);
			expect(keyRepo.calls.getSignature).toEqual(1);

			keyRepo.keys = [];
		};

		const case2 = async () => {
			// Testando o token mais velho possível e que ainda continua usando a assinatura mais nova
			const actualDate = Date.now();
			const oneHour = 1000 * 60 * 60;
			const oneHourEarlier = actualDate - oneHour;

			const iat = oneHourEarlier + 1000;

			const key = new Key({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				ttl: oneHour,
				actual: {
					content: randomBytes(100).toString('hex'),
					buildedAt: iat,
				},
			});

			await keyRepo.create(key);
			const token = tokenFactory({
				body: {
					data: 'any',
					iat: Math.floor(iat / 1000),
					exp: Math.floor((iat + oneHour + 1000) / 1000),
				},
				signature: key.actual.content,
			});

			const { sigState } = await sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			});
			expect(sigState === 'OK').toEqual(true);
			expect(keyRepo.calls.create).toEqual(2);
			expect(keyRepo.calls.getSignature).toEqual(2);

			keyRepo.keys = [];
		};

		await case1();
		await case2();
	});

	it('should validate the token and return sigState as \'DEPREACATED\'', async () => {
		const case1 = async () => {
			// Testando o token mais velho possível que usa a assinatura depreciada
			const actualDate = Date.now();
			const oneHour = 1000 * 60 * 60;
			const oneHourEarlier = actualDate - oneHour;

			const iat = oneHourEarlier + 1000;

			const key = new Key({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				ttl: oneHour,
				actual: {
					content: randomBytes(100).toString('hex'),
					buildedAt: actualDate,
				},
				prev: {
					content: randomBytes(100).toString('hex'),
					buildedAt: oneHourEarlier,
				},
			});

			await keyRepo.create(key);
			const token = tokenFactory({
				body: {
					data: 'any',
					iat: Math.floor(iat / 1000),
					exp: Math.floor((iat + oneHour) / 1000),
				},
				signature: key.prev!.content,
			});

			const { sigState } = await sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			});
			expect(sigState === 'DEPREACATED').toEqual(true);
			expect(keyRepo.calls.create).toEqual(1);
			expect(keyRepo.calls.getSignature).toEqual(1);

			keyRepo.keys = [];
		};

		const case2 = async () => {
			// Testando o token mais possível que faz o uso de assinaturas
			// depreciadas
			const actualDate = Date.now();
			const oneHour = 1000 * 60 * 60;

			const iat = actualDate - 1000;

			const key = new Key({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				ttl: oneHour,
				actual: {
					content: randomBytes(100).toString('hex'),
					buildedAt: actualDate,
				},
				prev: {
					content: randomBytes(100).toString('hex'),
					buildedAt: actualDate - oneHour,
				},
			});

			await keyRepo.create(key);
			const token = tokenFactory({
				body: {
					data: 'any',
					iat: Math.floor(iat / 1000),
					exp: Math.floor((iat + oneHour) / 1000),
				},
				signature: key.prev!.content,
			});

			const { sigState } = await sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			});
			expect(sigState === 'DEPREACATED').toEqual(true);
			expect(keyRepo.calls.create).toEqual(2);
			expect(keyRepo.calls.getSignature).toEqual(2);

			keyRepo.keys = [];
		};

		await case1();
		await case2();
	});

	it('should throw one error - out of time', async () => {
		const actualDate = Date.now();
		const oneHour = 1000 * 60 * 60;
		const oneHourEarlier = actualDate - oneHour;

		const key = new Key({
			name: KeysEnum.ACCESS_TOKEN_KEY,
			ttl: oneHour,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: actualDate,
			},
			prev: {
				content: randomBytes(100).toString('hex'),
				buildedAt: oneHourEarlier,
			},
		});

		await keyRepo.create(key);
		const token = tokenFactory({
			body: {
				data: 'any',
				iat: Math.floor((oneHourEarlier - 1000) / 1000),
				exp: Math.floor((actualDate - 1000) / 1000),
			},
			signature: key.prev!.content,
		});

		expect(
			sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			}),
		).rejects.toThrow(
			new ServiceErrors({
				message: 'Token expirado',
				tag: ServiceErrorsTags.unauthorized,
			}),
		);
		expect(keyRepo.calls.create).toEqual(1);
		expect(keyRepo.calls.getSignature).toEqual(1);
	});

	it('should throw one error - any good conditions was detected', async () => {
		const actualDate = Date.now();
		const oneHour = 1000 * 60 * 60;
		const oneHourEarlier = actualDate - oneHour;

		const key = new Key({
			name: KeysEnum.ACCESS_TOKEN_KEY,
			ttl: oneHour,
			actual: {
				content: randomBytes(100).toString('hex'),
				buildedAt: actualDate,
			},
		});

		await keyRepo.create(key);
		const token = tokenFactory({
			body: {
				data: 'any',
				exp: Math.floor((actualDate - 1000) / 1000),
				iat: Math.floor((oneHourEarlier - 1000) / 1000),
			},
			signature: randomBytes(100).toString('hex'),
		});

		expect(
			sut.exec({
				name: KeysEnum.ACCESS_TOKEN_KEY,
				token,
			}),
		).rejects.toThrow(
			new ServiceErrors({
				message: 'Token expirado',
				tag: ServiceErrorsTags.unauthorized,
			}),
		);
		expect(keyRepo.calls.create).toEqual(1);
		expect(keyRepo.calls.getSignature).toEqual(1);
	});
});
