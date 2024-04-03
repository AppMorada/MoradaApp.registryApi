import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Read condominium data E2E', () => {
	let app: INestApplication;
	const endpoints = {
		my: () => '/condominium/my',
		publicRoute: (id?: string) => `/condominium/${id}`,
	};

	beforeAll(async () => {
		app = await startApplication();
	});

	afterAll(async () => await app.close());

	it('should be able to read a condominium data - /condominium/my', async () => {
		const condominiumBodyInfo = condominiumFactory();
		const userBodyInfo = userFactory();
		const uniqueRegistryBodyInfo = uniqueRegistryFactory();

		const createCondominiumResponse = await request(app.getHttpServer())
			.post('/condominium')
			.set('content-type', 'application/json')
			.send({
				userName: userBodyInfo.name.value,
				condominiumName: condominiumBodyInfo.name.value,
				email: uniqueRegistryBodyInfo.email.value,
				password: userBodyInfo.password.value,
				CEP: condominiumBodyInfo.CEP.value,
				num: condominiumBodyInfo.num.value,
				CNPJ: condominiumBodyInfo.CNPJ.value,
			});

		const token = createCondominiumResponse.body?.accessToken;
		const condominium = createCondominiumResponse.body?.condominium;
		const readMyCondominiumData = await request(app.getHttpServer())
			.get(endpoints.my())
			.set('authorization', `Bearer ${token}`);

		expect(readMyCondominiumData.statusCode).toEqual(200);
		const searchedCondominium = readMyCondominiumData.body?.condominiums[0];
		expect(searchedCondominium.id).toEqual(condominium?.id);
		expect(searchedCondominium?.humanReadableId).toEqual(
			condominium?.humanReadableId,
		);
		expect(searchedCondominium.name).toEqual(condominium?.name);
		expect(searchedCondominium.CEP).toEqual(condominium?.CEP);
		expect(searchedCondominium.CNPJ).toEqual(condominium?.CNPJ);

		expect(typeof searchedCondominium.seedKey).toEqual('string');
		expect(searchedCondominium.createdAt).toEqual(condominium?.createdAt);
		expect(searchedCondominium.updatedAt).toEqual(condominium?.updatedAt);
	});

	it('should be able to read a condominium - /condominium/id', async () => {
		const condominiumBodyInfo = condominiumFactory();
		const userBodyInfo = userFactory();
		const uniqueRegistryBodyInfo = uniqueRegistryFactory();

		const createCondominiumResponse = await request(app.getHttpServer())
			.post('/condominium')
			.set('content-type', 'application/json')
			.send({
				userName: userBodyInfo.name.value,
				condominiumName: condominiumBodyInfo.name.value,
				email: uniqueRegistryBodyInfo.email.value,
				password: userBodyInfo.password.value,
				CEP: condominiumBodyInfo.CEP.value,
				num: condominiumBodyInfo.num.value,
				CNPJ: condominiumBodyInfo.CNPJ.value,
			});

		const condominium = createCondominiumResponse.body?.condominium;
		const readMyCondominiumData = await request(app.getHttpServer()).get(
			endpoints.publicRoute(condominium?.id),
		);

		expect(readMyCondominiumData.statusCode).toEqual(200);
		expect(readMyCondominiumData.body?.data?.id).toEqual(condominium?.id);
		expect(readMyCondominiumData.body?.data?.humanReadableId).toEqual(
			condominium?.humanReadableId,
		);
		expect(readMyCondominiumData.body?.data?.name).toEqual(
			condominium?.name,
		);
		expect(readMyCondominiumData.body?.data?.CEP).toEqual(condominium?.CEP);
		expect(readMyCondominiumData.body?.data?.CNPJ).toEqual(
			condominium?.CNPJ,
		);
		expect(readMyCondominiumData.body?.data?.seedKey).toBeFalsy();
		expect(readMyCondominiumData.body?.data?.createdAt).toEqual(
			condominium?.createdAt,
		);
		expect(readMyCondominiumData.body?.data?.updatedAt).toEqual(
			condominium?.updatedAt,
		);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const readMyCondominiumData = await request(app.getHttpServer()).get(
			endpoints.my(),
		);

		expect(readMyCondominiumData.statusCode).toEqual(401);
		expect(readMyCondominiumData.body?.statusCode).toEqual(401);
		expect(readMyCondominiumData.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});

	it('should be able to throw 400 because condominium id is malformed', async () => {
		const readMyCondominiumData = await request(app.getHttpServer()).get(
			endpoints.publicRoute(),
		);

		expect(readMyCondominiumData.statusCode).toEqual(400);
		expect(readMyCondominiumData.body?.statusCode).toEqual(400);
		expect(readMyCondominiumData.body?.message).toBeInstanceOf(Array);
	});
});
