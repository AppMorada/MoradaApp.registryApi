import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import request from 'supertest';

describe('Get my condominium request', () => {
	let app: INestApplication;
	const endpoints = {
		createRequest: (humanReadableId: string) =>
			`/condominium/requests/call/${humanReadableId}`,
		getMy: '/condominium/my/requests',
		createUser: '/user',
	};

	let condominiumInfos: any;

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
	});

	afterAll(async () => await app.close());

	it('should be able to get request condominium data', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'newuser@email.com',
		});
		const userName = 'New User';
		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send({
				name: userName,
				email: uniqueRegistry.email.value,
				password: '12345678',
				CPF: uniqueRegistry.CPF?.value,
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

		const myCondominiumRequestsResponse = await request(app.getHttpServer())
			.get(endpoints.getMy)
			.set(
				'authorization',
				`Bearer ${createUserResponse.body?.accessToken}`,
			)
			.send();

		expect(myCondominiumRequestsResponse.statusCode).toEqual(200);

		const body = myCondominiumRequestsResponse.body;
		const requestCollection = body?.requestCollection;

		expect(typeof requestCollection).toEqual('object');
		expect(requestCollection?.name).toEqual(userName);
		expect(requestCollection?.email).toEqual(uniqueRegistry.email.value);

		expect(requestCollection?.requests instanceof Array).toBe(true);
		expect(typeof requestCollection?.requests[0]?.userId).toEqual('string');
		expect(requestCollection?.requests[0]?.message).toBeNull();
		expect(typeof requestCollection?.requests[0]?.uniqueRegistryId).toEqual(
			'string',
		);
		expect(requestCollection?.requests[0]?.condominiumId).toEqual(
			condominiumInfos?.id,
		);
		expect(typeof requestCollection?.requests[0]?.createdAt).toEqual(
			'string',
		);
	});

	it('should throw 401 - user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.get(endpoints.getMy)
			.send();

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
