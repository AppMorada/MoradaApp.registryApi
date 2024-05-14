import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { UserWriteOps } from '@app/repositories/user/write';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { KeysEnum } from '@app/repositories/key';

describe('Create a enterprise member E2E', () => {
	let app: INestApplication;
	let createUserRepo: UserWriteOps.Create;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		createCondominium: '/condominium',
		createEnterpriseUser: (id: string) =>
			`/condominium/${id}/as-owner/enterprise-user`,
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

	it('should be able to create a enterprise member', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const user = userFactory();

		const createEnterpriseMemberResponse = await request(
			app.getHttpServer(),
		)
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

		expect(createEnterpriseMemberResponse.statusCode).toEqual(201);
	});

	it('should be able to throw 409 because member already exist', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const user = userFactory();

		const createEnterpriseMember = async () =>
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
			.post(endpoints.createEnterpriseUser(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`)
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
			.post(endpoints.createEnterpriseUser(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.send();

		expect(createEnterpriseMemberResponse.statusCode).toEqual(401);
		expect(createEnterpriseMemberResponse.body?.statusCode).toEqual(401);
		expect(createEnterpriseMemberResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
