import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Update condominium E2E', () => {
	let app: INestApplication;
	const endpoint = (id?: string) => `/condominium/${id}`;

	beforeAll(async () => {
		app = await startApplication();
	});

	afterAll(async () => await app.close());

	it('should be able to update a condominium', async () => {
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
		const updateCondominiumResponse = await request(app.getHttpServer())
			.patch(endpoint(condominium.id))
			.set('authorization', `Bearer ${token}`)
			.send({
				name: 'New condominium name',
				CEP: '65636-678',
				num: 64512,
			});

		expect(updateCondominiumResponse.statusCode).toEqual(200);

		const readMyCondominiumData = await request(app.getHttpServer())
			.get('/condominium/my')
			.set('authorization', `Bearer ${token}`);

		expect(readMyCondominiumData.body?.condominiums[0]?.name).toEqual(
			'New condominium name',
		);
		expect(readMyCondominiumData.body?.condominiums[0]?.CEP).toEqual(
			'65636678',
		);
		expect(readMyCondominiumData.body?.condominiums[0]?.num).toEqual(64512);
	});

	it('should be able to throw a 400', async () => {
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
		const updateCondominiumResponse = await request(app.getHttpServer())
			.patch(endpoint())
			.set('authorization', `Bearer ${token}`)
			.send();

		expect(updateCondominiumResponse.statusCode).toEqual(400);
		expect(updateCondominiumResponse.body?.statusCode).toEqual(400);
		expect(updateCondominiumResponse.body?.message).toBeInstanceOf(Array);
	});

	it('should be able to throw a 401', async () => {
		const updateCondominiumResponse = await request(app.getHttpServer())
			.patch(endpoint())
			.send();

		expect(updateCondominiumResponse.statusCode).toEqual(401);
		expect(updateCondominiumResponse.body?.statusCode).toEqual(401);
		expect(updateCondominiumResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
