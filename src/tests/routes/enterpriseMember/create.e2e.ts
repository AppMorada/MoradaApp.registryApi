import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Create a enterprise member E2E', () => {
	let app: INestApplication;
	const endpoint = (id: string) =>
		`/condominium/${id}/as-owner/enterprise-user`;
	let condominiumInfos: any;
	let token: any;

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

	it('should be able to create a enterprise member', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const user = userFactory();

		const createEnterpriseMemberResponse = await request(
			app.getHttpServer(),
		)
			.post(endpoint(condominiumInfos?.id))
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
	});

	it('should be able to throw 409 because member already exist', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const user = userFactory();

		const createEnterpriseMember = async () =>
			await request(app.getHttpServer())
				.post(endpoint(condominiumInfos?.id))
				.set('content-type', 'application/json')
				.set('authorization', `Bearer ${token}`)
				.send({
					name: 'Employee',
					email: uniqueRegistry.email.value,
					password: user.password.value,
					CPF: uniqueRegistry?.CPF?.value,
					phoneNumber: user?.phoneNumber?.value,
				});

		await createEnterpriseMember();
		const createEnterpriseMemberResponse = await createEnterpriseMember();
		expect(createEnterpriseMemberResponse.statusCode).toEqual(409);
		expect(createEnterpriseMemberResponse.body?.statusCode).toEqual(409);
		expect(createEnterpriseMemberResponse.body?.message).toEqual(
			'Conteúdo já existe',
		);
	});

	it('should be able to throw 400', async () => {
		const createEnterpriseMemberResponse = await request(
			app.getHttpServer(),
		)
			.post(endpoint(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`)
			.send();

		expect(createEnterpriseMemberResponse.statusCode).toEqual(400);
		expect(createEnterpriseMemberResponse.body?.statusCode).toEqual(400);
		expect(createEnterpriseMemberResponse.body?.message).toBeInstanceOf(
			Array,
		);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const createEnterpriseMemberResponse = await request(
			app.getHttpServer(),
		)
			.post(endpoint(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.send();

		expect(createEnterpriseMemberResponse.statusCode).toEqual(401);
		expect(createEnterpriseMemberResponse.body?.statusCode).toEqual(401);
		expect(createEnterpriseMemberResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
