import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Delete user E2E', () => {
	let app: INestApplication;
	const endpoint = '/user';

	beforeAll(async () => {
		app = await startApplication();
	});

	afterAll(async () => await app.close());

	it('should be able to delete a user and throw 401 because user doesn\'t exist anymore', async () => {
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		const createUserResponse = await request(app.getHttpServer())
			.post(endpoint)
			.set('content-type', 'application/json')
			.send({
				name: user.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: uniqueRegistry.CPF?.value,
			});

		expect(createUserResponse.statusCode).toEqual(202);

		const token = createUserResponse.body?.accessToken;
		const response = await request(app.getHttpServer())
			.delete(endpoint)
			.set('authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(204);

		const unauthorizedResponse = await request(app.getHttpServer())
			.delete(endpoint)
			.set('authorization', `Bearer ${token}`);
		expect(unauthorizedResponse.statusCode).toEqual(401);
		expect(unauthorizedResponse.body?.statusCode).toEqual(401);
		expect(unauthorizedResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});

	it('should throw 401 - user is not authenticated', async () => {
		const unauthorizedResponse = await request(app.getHttpServer()).delete(
			endpoint,
		);

		expect(unauthorizedResponse.statusCode).toEqual(401);
		expect(unauthorizedResponse.body?.statusCode).toEqual(401);
		expect(unauthorizedResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
