import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Delete user E2E', () => {
	let app: INestApplication;
	const endpoint = '/user';

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

		token = createCondominiumResponse.body?.accessToken;
	});

	afterAll(async () => await app.close());

	it('should be able to delete a user and throw 401', async () => {
		const response = await request(app.getHttpServer())
			.delete(endpoint)
			.set('authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(204);

		const unauthorizedResponse = await request(app.getHttpServer())
			.delete(endpoint)
			.set('authorization', `Bearer ${token}`);
		expect(unauthorizedResponse.statusCode).toEqual(401);
		expect(unauthorizedResponse.body?.statusCode).toEqual(401);
		expect(unauthorizedResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
