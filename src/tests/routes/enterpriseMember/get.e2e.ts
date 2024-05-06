import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { UserWriteOps } from '@app/repositories/user/write';
import { KeysEnum } from '@app/repositories/key';

describe('Get a enterprise member E2E', () => {
	let app: INestApplication;
	let createUserRepo: UserWriteOps.Create;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		createCondominium: '/condominium',
		createEnterpriseUser: (id?: string) =>
			`/condominium/${id}/as-owner/enterprise-user`,
		getOne: (condominiumId?: string, userId?: string) =>
			`/condominium/${condominiumId}/as-employee/enterprise-user/${userId}`,
		getAll: (condominiumId?: string) =>
			`/condominium/${condominiumId}/as-employee/enterprise-user/all`,
	};
	let condominiumInfos: any;
	let adminToken: any;

	beforeAll(async () => {
		app = await startApplication();
		createUserRepo = app.get(UserWriteOps.Create);
		genTFA = app.get(GenTFAService);
		genTokens = app.get(CreateTokenService);
	});

	beforeEach(async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();
		await createUserRepo.exec({ user, uniqueRegistry });

		const { code } = await genTFA.exec({
			existentUserContent: { user, uniqueRegistry },
			keyName: KeysEnum.CONDOMINIUM_VALIDATION_KEY,
		});
		const { accessToken } = await genTokens.exec({ user, uniqueRegistry });
		adminToken = accessToken;

		const createCondominiumResponse = await request(app.getHttpServer())
			.post(endpoints.createCondominium)
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${code}`)
			.send({
				name: condominium.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CEP: condominium.CEP.value,
				num: condominium.num.value,
				CNPJ: condominium.CNPJ.value,
				district: condominium.district.value,
				city: condominium.city.value,
				state: condominium.state.value,
				reference: condominium?.reference?.value,
				complement: condominium?.complement?.value,
			});

		expect(createCondominiumResponse.statusCode).toEqual(201);

		condominiumInfos = createCondominiumResponse.body?.condominium;
	});

	afterAll(async () => await app.close());

	it('should be able to get all enterprise members', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const user = userFactory();

		await request(app.getHttpServer())
			.post(endpoints.createEnterpriseUser(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Employee',
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: uniqueRegistry?.CPF?.value,
				phoneNumber: user?.phoneNumber?.value,
			});

		const response = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${adminToken}`);

		expect(response.statusCode).toEqual(200);

		const employee = response.body?.employees[0];
		expect(typeof employee?.user?.id).toEqual('string');
		expect(typeof employee?.user?.uniqueRegistryId).toEqual('undefined');
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
		).toEqual('undefined');
		expect(typeof employee?.condominiumMemberInfos?.userId).toEqual(
			'undefined',
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
			.post(endpoints.createEnterpriseUser(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`)
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
			.set('authorization', `Bearer ${adminToken}`);

		expect(getAllEnterpriseMembersResponse.statusCode).toEqual(200);

		const userId =
			getAllEnterpriseMembersResponse.body?.employees[0]?.user?.id;
		const getOneEnterpriseMemberResponse = await request(
			app.getHttpServer(),
		)
			.get(endpoints.getOne(condominiumInfos?.id, userId))
			.set('authorization', `Bearer ${adminToken}`);

		expect(getOneEnterpriseMemberResponse.statusCode).toEqual(200);

		const body = getOneEnterpriseMemberResponse.body;
		expect(typeof body?.userData?.id).toEqual('string');
		expect(typeof body?.userData?.uniqueRegistryId).toEqual('undefined');
		expect(body?.userData?.name).toEqual('Employee');
		expect(body?.userData?.phoneNumber).toEqual(user?.phoneNumber?.value);
		expect(typeof body?.userData?.createdAt).toEqual('string');
		expect(typeof body?.userData?.updatedAt).toEqual('string');

		expect(typeof body?.uniqueRegistry?.id).toEqual('string');
		expect(body?.uniqueRegistry?.email).toEqual(uniqueRegistry.email.value);
		expect(body?.uniqueRegistry?.CPF).toEqual(uniqueRegistry?.CPF?.value);

		expect(typeof body?.worksOn[0]?.id).toEqual('string');
		expect(typeof body?.worksOn[0]?.condominiumId).toEqual('string');
		expect(typeof body?.worksOn[0]?.uniqueRegistryId).toEqual('undefined');
		expect(typeof body?.worksOn[0]?.userId).toEqual('undefined');
		expect(typeof body?.worksOn[0]?.role).toEqual('number');
		expect(typeof body?.worksOn[0]?.updatedAt).toEqual('string');
		expect(typeof body?.worksOn[0]?.createdAt).toEqual('string');
	});

	it('should be able to throw 400', async () => {
		const getAllMembersResponse = await request(app.getHttpServer())
			.get(endpoints.getAll())
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`);

		const getOneMemberResponse = await request(app.getHttpServer())
			.get(endpoints.getOne())
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`);

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
