import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Login E2E', () => {
	let app: INestApplication;
	const endpoints = {
		createUser: '/user',
		login: '/login',
	};

	beforeAll(async () => {
		app = await startApplication();
	});

	afterAll(async () => await app.close());

	it('should be able to login', async () => {
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

		expect(createUserResponse.statusCode).toEqual(202);

		const response = await request(app.getHttpServer())
			.post(endpoints.login)
			.set('content-type', 'application/json')
			.send({
				email: uniqueRegistry.email.value,
				password: user.password.value,
			});

		expect(response.statusCode).toEqual(200);
		expect(typeof response.body?.accessToken).toEqual('string');
		expect(
			typeof response.headers['set-cookie'][0]?.split(
				'refresh-token=',
			)[1],
		).toEqual('string');
	});

	it('should be able to throw a 400', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.login)
			.set('content-type', 'application/json')
			.send();

		expect(response.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
		expect(response.body?.statusCode).toEqual(400);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.login)
			.set('content-type', 'application/json')
			.send({
				email: 'johndoe@email.com',
				password: '12345678',
			});

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
