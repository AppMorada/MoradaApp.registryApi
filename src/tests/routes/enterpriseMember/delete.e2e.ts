import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { UUID } from '@app/entities/VO';

describe('Delete enterprise member E2E', () => {
	let app: INestApplication;
	const endpoints = {
		create: (id?: string) => `/condominium/${id}/as-owner/enterprise-user`,
		getOne: (condominiumId?: string, userId?: string) =>
			`/condominium/${condominiumId}/as-employee/enterprise-user/${userId}`,
		getAll: (condominiumId?: string) =>
			`/condominium/${condominiumId}/as-employee/enterprise-user/all`,
		delete: (condominiumId?: string, userId?: string) =>
			`/condominium/${condominiumId}/as-owner/enterprise-user/${userId}`,
	};
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

	it('should be able to delete one enterprise member', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const user = userFactory();

		await request(app.getHttpServer())
			.post(endpoints.create(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`)
			.send({
				name: 'Employee',
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: uniqueRegistry?.CPF?.value,
				phoneNumber: user?.phoneNumber?.value,
			});

		const getAllEnterpriseMembersResponse = await request(
			app.getHttpServer(),
		)
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${token}`);

		const userId =
			getAllEnterpriseMembersResponse.body?.employees[0]?.user?.id;
		const deleteEnterpriseMemberResponse = await request(
			app.getHttpServer(),
		)
			.delete(endpoints.delete(condominiumInfos?.id, userId))
			.set('authorization', `Bearer ${token}`);

		expect(deleteEnterpriseMemberResponse.statusCode).toEqual(204);
		const searchedMember = await request(app.getHttpServer())
			.get(endpoints.getOne(condominiumInfos?.id, userId))
			.set('authorization', `Bearer ${token}`);

		expect(searchedMember.statusCode).toEqual(200);
		expect(searchedMember.body?.userData).toBeNull();
		expect(searchedMember.body?.uniqueRegistry).toBeNull();
		expect(searchedMember.body?.worksOn).toBeNull();
	});

	it('should be able to throw a 400', async () => {
		const response = await request(app.getHttpServer())
			.delete(endpoints.delete())
			.set('authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(400);
		expect(response.body?.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
	});

	it('should be able to throw a 401', async () => {
		const response = await request(app.getHttpServer()).delete(
			endpoints.delete(UUID.genV4().value, UUID.genV4().value),
		);

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
