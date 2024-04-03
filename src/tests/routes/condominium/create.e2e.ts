import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Create condominium E2E', () => {
	let app: INestApplication;
	const endpoint = '/condominium';

	beforeAll(async () => {
		app = await startApplication();
	});

	afterAll(async () => await app.close());

	it('should be able to create a condominium', async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		const response = await request(app.getHttpServer())
			.post(endpoint)
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

		expect(response.statusCode).toEqual(201);

		expect(typeof response.body?.accessToken).toEqual('string');
		expect(
			typeof response.headers['set-cookie'][0]?.split(
				'refresh-token=',
			)[1],
		).toEqual('string');

		expect(typeof response.body?.condominium?.id).toEqual('string');
		expect(typeof response.body?.condominium?.humanReadableId).toEqual(
			'string',
		);
		expect(typeof response.body?.condominium?.ownerId).toEqual('string');
		expect(typeof response.body?.condominium?.createdAt).toEqual('string');
		expect(typeof response.body?.condominium?.updatedAt).toEqual('string');

		expect(response.body?.condominium?.name).toEqual(
			condominium.name.value,
		);
		expect(response.body?.condominium?.CEP).toEqual(condominium.CEP.value);
		expect(response.body?.condominium?.num).toEqual(condominium.num.value);
		expect(response.body?.condominium?.CNPJ).toEqual(
			condominium.CNPJ.value,
		);
	});

	it('should be able to throw a 400', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoint)
			.send();

		expect(response.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
		expect(response.body?.statusCode).toEqual(400);
	});

	it('should be able to throw a 409 because condominium already exists', async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		await request(app.getHttpServer())
			.post(endpoint)
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

		const response = await request(app.getHttpServer())
			.post(endpoint)
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

		expect(response.statusCode).toEqual(409);
		expect(response.body?.statusCode).toEqual(409);
		expect(response.body?.message).toEqual('Conteúdo já existe');
	});
});
