import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import request from 'supertest';

describe('Create condominium request', () => {
	let app: INestApplication;
	const endpoints = {
		createRequest: (humanReadableId: string) =>
			`/condominium/requests/call/${humanReadableId}`,
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

	it('should be able to request a membership of one user', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'newuser@email.com',
		});
		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send({
				name: 'New User',
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
	});

	it('should throw 409 - request already exist', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'newuser@email.com',
		});
		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send({
				name: 'New User',
				email: uniqueRegistry.email.value,
				password: '12345678',
				CPF: uniqueRegistry.CPF?.value,
			});

		expect(createUserResponse.statusCode).toEqual(202);
		const call = async () =>
			await request(app.getHttpServer())
				.post(endpoints.createRequest(condominiumInfos.humanReadableId))
				.set(
					'authorization',
					`Bearer ${createUserResponse.body?.accessToken}`,
				)
				.send();

		await call();
		const requestMembershipResponse = await call();
		expect(requestMembershipResponse.statusCode).toEqual(409);
		expect(requestMembershipResponse.body?.statusCode).toEqual(409);
		expect(requestMembershipResponse.body?.message).toEqual(
			'Conteúdo já existe',
		);
	});

	it('should throw 401 - user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.createRequest(condominiumInfos.humanReadableId))
			.send();

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
