import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Update user E2E', () => {
	let app: INestApplication;
	const endpoints = {
		default: '/user',
		get: '/user/enterprise-user-section',
	};

	beforeAll(async () => {
		app = await startApplication();
	});

	afterAll(async () => await app.close());

	it('should update user data', async () => {
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

		expect(createUserResponse.statusCode).toEqual(201);

		const token = createUserResponse.body?.accessToken;

		const updateUserResponse = await request(app.getHttpServer())
			.patch(endpoints.default)
			.set('authorization', `Bearer ${token}`)
			.send({
				name: 'New name',
				phoneNumber: '31 6565-9897',
			});

		expect(updateUserResponse.statusCode).toEqual(200);
		expect(typeof updateUserResponse.body?.accessToken).toEqual('string');
		expect(
			typeof updateUserResponse.headers['set-cookie'][0]?.split(
				'refresh-token=',
			)[1],
		).toEqual('string');

		const searchedUserDataResponse = await request(app.getHttpServer())
			.get(endpoints.get)
			.set('authorization', `Bearer ${token}`);

		expect(searchedUserDataResponse.statusCode).toEqual(200);
		expect(searchedUserDataResponse.body?.name).toEqual('New name');
		expect(searchedUserDataResponse.body?.phoneNumber).toEqual(
			'3165659897',
		);
	});

	it('should be able to throw a 400', async () => {
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

		expect(createUserResponse.statusCode).toEqual(201);

		const token = createUserResponse.body?.accessToken;

		const response = await request(app.getHttpServer())
			.patch(endpoints.default)
			.set('authorization', `Bearer ${token}`)
			.send({
				name: 21,
				phoneNumber: 21,
			});

		expect(response.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
		expect(response.body?.statusCode).toEqual(400);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.patch(endpoints.default)
			.send();

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
