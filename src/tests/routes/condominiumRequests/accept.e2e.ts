import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import request from 'supertest';
import { KeysEnum } from '@app/repositories/key';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { UserRepoWriteOps } from '@app/repositories/user/write';

describe('Accept condominium request', () => {
	let app: INestApplication;
	let userRepo: UserRepoWriteOps;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		createCondominium: '/condominium',
		createRequest: (humanReadableId: string) =>
			`/condominium/requests/call/${humanReadableId}`,
		createUser: '/user',
		getAll: (condominiumId?: string) =>
			`/condominium/requests/${condominiumId}`,
		accept: (condominiumId?: string, userId?: string) =>
			`/condominium/requests/${condominiumId}/accept/${userId}`,
	};

	let condominiumInfos: any;
	let adminToken: any;
	const newUserInfos = {
		name: '',
		email: '',
	};

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

		const uniqueRegistry2 = uniqueRegistryFactory({
			email: 'newuser@email.com',
		});
		newUserInfos.name = 'New User';
		newUserInfos.email = uniqueRegistry2.email.value;
		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send({
				name: newUserInfos.name,
				email: newUserInfos.email,
				password: '12345678',
				CPF: uniqueRegistry2.CPF?.value,
			});

		expect(createUserResponse.statusCode).toEqual(202);
		const requestMembershipResponse = await request(app.getHttpServer())
			.post(endpoints.createRequest(condominiumInfos.humanReadableId))
			.set(
				'authorization',
				`Bearer ${createUserResponse.body?.accessToken}`,
			)
			.send();

		expect(requestMembershipResponse.statusCode).toEqual(201);
	});

	afterAll(async () => await app.close());

	it('should be able to accept a request a membership of one user', async () => {
		const requestCollectionResponse = await request(app.getHttpServer())
			.get(endpoints.getAll(condominiumInfos?.id))
			.set('authorization', `Bearer ${adminToken}`)
			.send();

		expect(requestCollectionResponse.statusCode).toEqual(200);
		const body = requestCollectionResponse.body;
		const userId = body?.requestCollection[0]?.request?.userId;

		const response = await request(app.getHttpServer())
			.post(endpoints.accept(condominiumInfos.id, userId))
			.set('authorization', `Bearer ${adminToken}`)
			.send();

		expect(response.statusCode).toEqual(201);
	});

	it('should throw 400 - request already exist', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.accept())
			.set('authorization', `Bearer ${adminToken}`)
			.send();

		expect(response.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
		expect(response.body?.statusCode).toEqual(400);
	});

	it('should throw 401 - user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.accept())
			.send();

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});