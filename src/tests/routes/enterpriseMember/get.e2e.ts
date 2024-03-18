import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';

describe('Get a enterprise member E2E', () => {
	let app: INestApplication;
	const endpoints = {
		create: (id?: string) => `/condominium/${id}/as-owner/enterprise-user`,
		getOne: (condominiumId?: string, userId?: string) =>
			`/condominium/${condominiumId}/as-employee/enterprise-user/${userId}`,
		getAll: (condominiumId?: string) =>
			`/condominium/${condominiumId}/as-employee/enterprise-user/all`,
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

	it('should be able to get all enterprise members', async () => {
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

		const response = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${token}`);

		expect(response.statusCode).toEqual(200);

		const employee = response.body?.employees[0];
		expect(typeof employee?.user?.id).toEqual('string');
		expect(typeof employee?.user?.uniqueRegistryId).toEqual('string');
		expect(employee?.user?.name).toEqual('Employee');
		expect(employee?.user?.phoneNumber).toEqual(user?.phoneNumber?.value);
		expect(typeof employee?.user?.createdAt).toEqual('string');
		expect(typeof employee?.user?.updatedAt).toEqual('string');

		expect(typeof employee?.uniqueRegistry?.id).toEqual('string');
		expect(employee?.uniqueRegistry?.email).toEqual(
			uniqueRegistry.email.value,
		);
		expect(employee?.uniqueRegistry?.CPF).toEqual(
			uniqueRegistry?.CPF?.value,
		);

		expect(typeof employee?.condominiumMemberInfos?.id).toEqual('string');
		expect(typeof employee?.condominiumMemberInfos?.condominiumId).toEqual(
			'string',
		);
		expect(
			typeof employee?.condominiumMemberInfos?.uniqueRegistryId,
		).toEqual('string');
		expect(typeof employee?.condominiumMemberInfos?.userId).toEqual(
			'string',
		);
		expect(typeof employee?.condominiumMemberInfos?.role).toEqual('number');
		expect(typeof employee?.condominiumMemberInfos?.updatedAt).toEqual(
			'string',
		);
		expect(typeof employee.condominiumMemberInfos?.createdAt).toEqual(
			'string',
		);
	});

	it('should be able to get one community member', async () => {
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

		expect(getAllEnterpriseMembersResponse.statusCode).toEqual(200);

		const userId =
			getAllEnterpriseMembersResponse.body?.employees[0]?.user?.id;
		const getOneEnterpriseMemberResponse = await request(
			app.getHttpServer(),
		)
			.get(endpoints.getOne(condominiumInfos?.id, userId))
			.set('authorization', `Bearer ${token}`);

		expect(getOneEnterpriseMemberResponse.statusCode).toEqual(200);

		const body = getOneEnterpriseMemberResponse.body;
		expect(typeof body?.userData?.id).toEqual('string');
		expect(typeof body?.userData?.uniqueRegistryId).toEqual('string');
		expect(body?.userData?.name).toEqual('Employee');
		expect(body?.userData?.phoneNumber).toEqual(user?.phoneNumber?.value);
		expect(typeof body?.userData?.createdAt).toEqual('string');
		expect(typeof body?.userData?.updatedAt).toEqual('string');

		expect(typeof body?.uniqueRegistry?.id).toEqual('string');
		expect(body?.uniqueRegistry?.email).toEqual(uniqueRegistry.email.value);
		expect(body?.uniqueRegistry?.CPF).toEqual(uniqueRegistry?.CPF?.value);

		expect(typeof body?.worksOn[0]?.id).toEqual('string');
		expect(typeof body?.worksOn[0]?.condominiumId).toEqual('string');
		expect(typeof body?.worksOn[0]?.uniqueRegistryId).toEqual('string');
		expect(typeof body?.worksOn[0]?.userId).toEqual('string');
		expect(typeof body?.worksOn[0]?.role).toEqual('number');
		expect(typeof body?.worksOn[0]?.updatedAt).toEqual('string');
		expect(typeof body?.worksOn[0]?.createdAt).toEqual('string');
	});

	it('should be able to throw 400', async () => {
		const getAllMembersResponse = await request(app.getHttpServer())
			.get(endpoints.getAll())
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`);

		const getOneMemberResponse = await request(app.getHttpServer())
			.get(endpoints.getOne())
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${token}`);

		expect(getAllMembersResponse.statusCode).toEqual(400);
		expect(getAllMembersResponse.body?.statusCode).toEqual(400);
		expect(getAllMembersResponse.body?.message).toBeInstanceOf(Array);

		expect(getOneMemberResponse.statusCode).toEqual(400);
		expect(getOneMemberResponse.body?.statusCode).toEqual(400);
		expect(getOneMemberResponse.body?.message).toBeInstanceOf(Array);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const getAllMembersResponse = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('content-type', 'application/json');

		const getOneMemberResponse = await request(app.getHttpServer())
			.get(endpoints.getOne(condominiumInfos?.id))
			.set('content-type', 'application/json');

		expect(getAllMembersResponse.statusCode).toEqual(401);
		expect(getAllMembersResponse.body?.statusCode).toEqual(401);
		expect(getAllMembersResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);

		expect(getOneMemberResponse.statusCode).toEqual(401);
		expect(getOneMemberResponse.body?.statusCode).toEqual(401);
		expect(getOneMemberResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
