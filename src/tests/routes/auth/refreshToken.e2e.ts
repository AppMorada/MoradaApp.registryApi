import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Refresh token E2E', () => {
	let app: INestApplication;
	const endpoints = {
		createUser: '/user',
		login: '/login',
		refreshToken: '/refresh-tokens',
	};

	beforeAll(async () => {
		app = await startApplication();
	});

	afterAll(async () => await app.close());

	it('should be able to refresh tokens', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'newuser@email.com',
		});
		const user = userFactory({ uniqueRegistryId: uniqueRegistry.id.value });

		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send({
				name: user.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: uniqueRegistry.CPF?.value,
			});

		expect(createUserResponse.statusCode).toEqual(201);

		const loginResponse = await request(app.getHttpServer())
			.post(endpoints.login)
			.set('content-type', 'application/json')
			.send({
				email: uniqueRegistry.email.value,
				password: user.password.value,
			});

		expect(loginResponse.statusCode).toEqual(200);
		const refreshToken =
			loginResponse.headers['set-cookie'][0]?.split(';')[0];
		const refreshTokenResponse = await request(app.getHttpServer())
			.get(endpoints.refreshToken)
			.set('Cookie', refreshToken);

		expect(refreshTokenResponse.statusCode).toEqual(200);
		expect(typeof refreshTokenResponse.body?.accessToken).toEqual('string');
		expect(
			typeof refreshTokenResponse.headers['set-cookie'][0]?.split(
				'refresh-token=',
			)[1],
		).toEqual('string');
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.get(endpoints.refreshToken)
			.set('content-type', 'application/json');

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
