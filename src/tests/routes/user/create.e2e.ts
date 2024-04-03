import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import request from 'supertest';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Create a user E2E', () => {
	let app: INestApplication;
	const endpoint = '/user';

	beforeAll(async () => {
		app = await startApplication();
	});

	afterAll(async () => await app.close());

	it('should be able to create a user', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'newuser@email.com',
		});
		const response = await request(app.getHttpServer())
			.post(endpoint)
			.set('content-type', 'application/json')
			.send({
				name: 'New User',
				email: uniqueRegistry.email.value,
				password: '12345678',
				CPF: uniqueRegistry.CPF?.value,
			});

		expect(response.statusCode).toEqual(202);
		expect(typeof response.body?.accessToken).toEqual('string');
		expect(
			typeof response.headers['set-cookie'][0]?.split(
				'refresh-token=',
			)[1],
		).toEqual('string');
	});

	it('should be able to throw 400', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoint)
			.set('content-type', 'application/json')
			.send();

		expect(response.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
		expect(response.body?.statusCode).toEqual(400);
	});

	it('should be able to throw 409 because user is already exist', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		const call = async () =>
			await request(app.getHttpServer())
				.post(endpoint)
				.set('content-type', 'application/json')
				.send({
					name: 'New User',
					email: uniqueRegistry.email.value,
					password: '12345678',
					CPF: uniqueRegistry.CPF?.value,
				});

		await call();
		const response = await call();

		expect(response.statusCode).toEqual(409);
		expect(response.body?.statusCode).toEqual(409);
		expect(response.body?.message).toEqual('Conteúdo já existe');
	});
});
