import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { UserWriteOps } from '@app/repositories/user/write';
import { CreateTokenService } from '@app/services/login/createToken.service';

describe('Validate condominium account E2E', () => {
	let app: INestApplication;
	let createUserRepo: UserWriteOps.Create;
	let genTokens: CreateTokenService;

	const endpoints = {
		validateAccount: '/condominium/validate-account',
		createUser: '/user',
	};

	beforeAll(async () => {
		app = await startApplication();
		createUserRepo = app.get(UserWriteOps.Create);
		genTokens = app.get(CreateTokenService);
	});

	afterAll(async () => await app.close());

	it('should be able to validate condominium account', async () => {
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		await createUserRepo.exec({ user, uniqueRegistry });
		const { accessToken } = await genTokens.exec({ user, uniqueRegistry });

		const response = await request(app.getHttpServer())
			.post(endpoints.validateAccount)
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${accessToken}`);

		expect(response.statusCode).toEqual(202);
	});

	it('should be able to throw a 401 - user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.validateAccount)
			.send();

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
