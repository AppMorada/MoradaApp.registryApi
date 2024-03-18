import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Delete condominium E2E', () => {
	let app: INestApplication;
	const endpoint = (id?: string) => `/condominium/${id}`;

	beforeAll(async () => {
		app = await startApplication();
	});

	afterAll(async () => await app.close());

	it('should be able to delete a condominium', async () => {
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

		const deleteCondominiumReponse = await request(app.getHttpServer())
			.delete(endpoint(condominium.id))
			.set('authorization', `Bearer ${token}`);
		expect(deleteCondominiumReponse.statusCode).toEqual(204);

		const readMyCondominiumData = await request(app.getHttpServer())
			.get('/condominium/my')
			.set('authorization', `Bearer ${token}`);
		expect(readMyCondominiumData.statusCode).toEqual(200);
		expect(readMyCondominiumData.body?.condominiums.length).toEqual(0);
	});

	it('should be able to throw 400 because condominium id is malformed', async () => {
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
		const deleteCondominiumReponse = await request(app.getHttpServer())
			.delete(endpoint())
			.set('authorization', `Bearer ${token}`);
		expect(deleteCondominiumReponse.statusCode).toEqual(400);
		expect(deleteCondominiumReponse.body?.statusCode).toEqual(400);
		expect(deleteCondominiumReponse.body?.message).toBeInstanceOf(Array);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const deleteCondominiumReponse = await request(
			app.getHttpServer(),
		).delete(endpoint());
		expect(deleteCondominiumReponse.statusCode).toEqual(401);
		expect(deleteCondominiumReponse.body?.statusCode).toEqual(401);
		expect(deleteCondominiumReponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
