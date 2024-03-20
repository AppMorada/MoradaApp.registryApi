import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Get user with enterprise member section E2E', () => {
	let app: INestApplication;
	const endpoints = {
		default: '/user',
		createEmployee: (condominiumId: string) =>
			`/condominium/${condominiumId}/as-owner/enterprise-user`,
		get: '/user/me/enterprise-user-section',
		login: '/login',
	};

	let token: any;
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
		token = createCondominiumResponse.body?.accessToken;
	});

	afterAll(async () => await app.close());

	it('should be able to get a user data', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const user = userFactory();

		const createEnterpriseMemberResponse = await request(
			app.getHttpServer(),
		)
			.post(endpoints.createEmployee(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`)
			.send({
				name: 'Employee',
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: uniqueRegistry?.CPF?.value,
				phoneNumber: user?.phoneNumber?.value,
			});

		expect(createEnterpriseMemberResponse.statusCode).toEqual(201);

		const enterpriseLoginResponse = await request(app.getHttpServer())
			.post(endpoints.login)
			.set('content-type', 'application/json')
			.send({
				email: uniqueRegistry.email.value,
				password: user.password.value,
			});
		const getUserResponse = await request(app.getHttpServer())
			.get(endpoints.get)
			.set(
				'authorization',
				`Bearer ${enterpriseLoginResponse.body?.accessToken}`,
			);

		expect(getUserResponse.statusCode).toEqual(200);

		const body = getUserResponse.body;
		expect(typeof body?.id).toEqual('string');
		expect(body?.name).toEqual('Employee');
		expect(typeof body?.uniqueRegistryId).toEqual('string');
		expect(body?.phoneNumber).toEqual(user?.phoneNumber?.value);
		expect(body?.tfa).toEqual(false);

		expect(typeof body?.uniqueRegistry?.id).toEqual('string');
		expect(typeof body?.uniqueRegistry?.email).toEqual('string');
		expect(typeof body?.uniqueRegistry?.CPF).toEqual('string');

		expect(typeof body?.employeeRelations[0]?.id).toEqual('string');
		expect(typeof body?.employeeRelations[0]?.condominiumId).toEqual(
			'string',
		);
		expect(typeof body?.employeeRelations[0]?.uniqueRegistryId).toEqual(
			'string',
		);
		expect(typeof body?.employeeRelations[0]?.userId).toEqual('string');
		expect(body?.employeeRelations[0]?.role).toEqual(1);
		expect(typeof body?.employeeRelations[0]?.updatedAt).toEqual('string');
		expect(typeof body?.employeeRelations[0]?.createdAt).toEqual('string');
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const response = await request(app.getHttpServer()).get(endpoints.get);

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
