import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { UserRepoWriteOps } from '@app/repositories/user/write';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { KeysEnum } from '@app/repositories/key';
import { CreateTokenService } from '@app/services/login/createToken.service';

describe('Get user with enterprise member section E2E', () => {
	let app: INestApplication;
	let userRepo: UserRepoWriteOps;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		createCondominium: '/condominium',
		default: '/user',
		createEmployee: (condominiumId: string) =>
			`/condominium/${condominiumId}/as-owner/enterprise-user`,
		get: '/user/enterprise-user-section',
		login: '/login',
	};

	let adminToken: any;
	let condominiumInfos: any;

	beforeAll(async () => {
		app = await startApplication();
		userRepo = app.get(UserRepoWriteOps);
		genTFA = app.get(GenTFAService);
		genTokens = app.get(CreateTokenService);
	});

	beforeEach(async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();
		await userRepo.create({ user, uniqueRegistry });

		const { code } = await genTFA.exec({
			existentUserContent: { uniqueRegistry, user },
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

	it('should be able to get a user data', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const user = userFactory();

		const createEnterpriseMemberResponse = await request(
			app.getHttpServer(),
		)
			.post(endpoints.createEmployee(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Employee',
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: uniqueRegistry?.CPF?.value,
				phoneNumber: user?.phoneNumber?.value,
			});

		expect(createEnterpriseMemberResponse.statusCode).toEqual(201);

		const enterpriseLoginResponse = await request(app.getHttpServer())
			.post(endpoints.login)
			.set('content-type', 'application/json')
			.send({
				email: uniqueRegistry.email.value,
				password: user.password.value,
			});
		const getUserResponse = await request(app.getHttpServer())
			.get(endpoints.get)
			.set(
				'authorization',
				`Bearer ${enterpriseLoginResponse.body?.accessToken}`,
			);

		expect(getUserResponse.statusCode).toEqual(200);

		const body = getUserResponse.body;
		expect(typeof body?.id).toEqual('string');
		expect(body?.name).toEqual('Employee');
		expect(typeof body?.uniqueRegistryId).toEqual('undefined');
		expect(typeof body?.password).toEqual('undefined');
		expect(body?.phoneNumber).toEqual(user?.phoneNumber?.value);
		expect(body?.tfa).toEqual(false);

		expect(typeof body?.uniqueRegistry?.id).toEqual('string');
		expect(typeof body?.uniqueRegistry?.email).toEqual('string');
		expect(typeof body?.uniqueRegistry?.CPF).toEqual('string');

		const employeeRelation = body?.employeeRelations[0];
		expect(typeof employeeRelation?.id).toEqual('string');
		expect(typeof employeeRelation?.condominiumId).toEqual('string');
		expect(typeof employeeRelation?.uniqueRegistryId).toEqual('undefined');
		expect(typeof employeeRelation?.userId).toEqual('undefined');
		expect(employeeRelation?.role).toEqual(1);
		expect(typeof employeeRelation?.updatedAt).toEqual('string');
		expect(typeof employeeRelation?.createdAt).toEqual('string');
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const response = await request(app.getHttpServer()).get(endpoints.get);

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
