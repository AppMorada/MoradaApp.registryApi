import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { UUID } from '@app/entities/VO';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { UserRepoWriteOps } from '@app/repositories/user/write';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { KeysEnum } from '@app/repositories/key';

describe('Update enterprise member E2E', () => {
	let app: INestApplication;
	let userRepo: UserRepoWriteOps;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		createCondominium: '/condominium',
		create: (id?: string) => `/condominium/${id}/as-owner/enterprise-user`,
		getOne: (condominiumId?: string, userId?: string) =>
			`/condominium/${condominiumId}/as-employee/enterprise-user/${userId}`,
		getAll: (condominiumId?: string) =>
			`/condominium/${condominiumId}/as-employee/enterprise-user/all`,
		update: (condominiumId?: string, userId?: string) =>
			`/condominium/${condominiumId}/as-employee/enterprise-user/${userId}`,
	};
	let condominiumInfos: any;
	let adminToken: any;

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
			email: uniqueRegistry.email,
			userId: user.id,
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

	it('should be able to update one enterprise member', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});
		const user = userFactory();

		await request(app.getHttpServer())
			.post(endpoints.create(condominiumInfos?.id))
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

		const userId =
			getAllEnterpriseMembersResponse.body?.employees[0]?.user?.id;
		const updateEnterpriseMemberResponse = await request(
			app.getHttpServer(),
		)
			.patch(endpoints.update(condominiumInfos?.id, userId))
			.set('authorization', `Bearer ${adminToken}`)
			.send({
				name: 'New name',
				phoneNumber: '32 6565-3232',
			});

		expect(updateEnterpriseMemberResponse.statusCode).toEqual(200);
		const searchedMember = await request(app.getHttpServer())
			.get(endpoints.getOne(condominiumInfos?.id, userId))
			.set('authorization', `Bearer ${adminToken}`);

		expect(searchedMember.statusCode).toEqual(200);
		expect(searchedMember.body?.userData.phoneNumber).toEqual('3265653232');
		expect(searchedMember.body?.userData.name).toEqual('New name');
	});

	it('should be able to throw a 400', async () => {
		const response = await request(app.getHttpServer())
			.patch(endpoints.update())
			.set('authorization', `Bearer ${adminToken}`);

		expect(response.statusCode).toEqual(400);
		expect(response.body?.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
	});

	it('should be able to throw a 401', async () => {
		const response = await request(app.getHttpServer()).patch(
			endpoints.update(UUID.genV4().value, UUID.genV4().value),
		);

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
