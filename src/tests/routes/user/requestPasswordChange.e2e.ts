import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Request Password Change E2E', () => {
	let app: INestApplication;
	const endpoints = {
		default: '/user',
		requestPasswordChange: '/user/request-password-update',
	};

	beforeEach(async () => {
		app = await startApplication();
	});

	afterEach(async () => await app.close());

	it('should request password change data', async () => {
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.default)
			.set('content-type', 'application/json')
			.send({
				name: user.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: uniqueRegistry.CPF?.value,
			});

		expect(createUserResponse.statusCode).toEqual(202);

		const requestPasswordChangeResponse = await request(app.getHttpServer())
			.post(endpoints.requestPasswordChange)
			.send({
				email: uniqueRegistry.email.value,
			});

		expect(requestPasswordChangeResponse.statusCode).toEqual(202);
	});

	it('should be able to throw a 400', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.requestPasswordChange)
			.send();

		expect(response.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
		expect(response.body?.statusCode).toEqual(400);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.requestPasswordChange)
			.send({
				email: 'random@email.com',
			});

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
