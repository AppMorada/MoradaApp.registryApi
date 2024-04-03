import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import request from 'supertest';

describe('Delete condominium request', () => {
	let app: INestApplication;
	const endpoints = {
		createRequest: (humanReadableId?: string) =>
			`/condominium/requests/call/${humanReadableId}`,
		delete: (condominiumId?: string, userId?: string) =>
			`/condominium/requests/${condominiumId}/${userId}`,
		getAll: (condominiumId?: string) =>
			`/condominium/requests/${condominiumId}`,
		createUser: '/user',
	};

	let condominiumInfos: any;
	let adminToken: any;
	const newUserInfos = {
		name: '',
		email: '',
	};

	beforeAll(async () => {
		app = await startApplication();
	});

	beforeEach(async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		const createCondominiumResponse = await request(app.getHttpServer())
			.post('/condominium')
			.set('content-type', 'application/json')
			.send({
				userName: user.name.value,
				condominiumName: condominium.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CEP: condominium.CEP.value,
				num: condominium.num.value,
				CNPJ: condominium.CNPJ.value,
			});

		condominiumInfos = createCondominiumResponse.body?.condominium;
		adminToken = createCondominiumResponse.body?.accessToken;

		const uniqueRegistry2 = uniqueRegistryFactory({
			email: 'newuser@email.com',
		});
		newUserInfos.name = 'New User';
		newUserInfos.email = uniqueRegistry2.email.value;
		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send({
				name: newUserInfos.name,
				email: newUserInfos.email,
				password: '12345678',
				CPF: uniqueRegistry2.CPF?.value,
			});

		expect(createUserResponse.statusCode).toEqual(202);
		const requestMembershipResponse = await request(app.getHttpServer())
			.post(endpoints.createRequest(condominiumInfos.humanReadableId))
			.set(
				'authorization',
				`Bearer ${createUserResponse.body?.accessToken}`,
			)
			.send();

		expect(requestMembershipResponse.statusCode).toEqual(201);
	});

	afterAll(async () => await app.close());

	it('should be able delete a condominium request', async () => {
		const requestCollectionResponse = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${adminToken}`)
			.send();

		const requestCollection =
			requestCollectionResponse.body?.requestCollection;
		const userId = requestCollection[0]?.request?.userId;

		const response = await request(app.getHttpServer())
			.delete(endpoints.delete(condominiumInfos.id, userId))
			.set('authorization', `Bearer ${adminToken}`)
			.send();

		expect(response.statusCode).toEqual(204);
	});

	it('should throw 400', async () => {
		const response = await request(app.getHttpServer())
			.delete(endpoints.delete())
			.set('authorization', `Bearer ${adminToken}`)
			.send();

		expect(response.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
		expect(response.body?.statusCode).toEqual(400);
	});

	it('should throw 401 - user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.delete(endpoints.delete())
			.send();

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
