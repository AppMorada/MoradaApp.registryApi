import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import request from 'supertest';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { UserWriteOps } from '@app/repositories/user/write';
import { condominiumFactory } from '@tests/factories/condominium';
import { userFactory } from '@tests/factories/user';
import { KeysEnum } from '@app/repositories/key';
import { communityInfosFactory } from '@tests/factories/communityInfos';

describe('Create a user with condominium member context E2E', () => {
	let app: INestApplication;
	let createUserRepo: UserWriteOps.Create;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		createUser: '/user/condominium-member-context',
		createCondominium: '/condominium',
		invite: (id: string) =>
			`/condominium/${id}/as-owner/community-member/invite`,
	};
	let condominiumInfos: any;
	let adminToken: any;

	beforeEach(async () => {
		app = await startApplication();
		createUserRepo = app.get(UserWriteOps.Create);
		genTFA = app.get(GenTFAService);
		genTokens = app.get(CreateTokenService);

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

	afterEach(async () => await app.close());

	it('should be able to create a user and return 201', async () => {
		const communityInfo = communityInfosFactory();
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		const inviteNewCommunityMemberResponse = await request(
			app.getHttpServer(),
		)
			.post(endpoints.invite(condominiumInfos?.id))
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${adminToken}`)
			.send({
				members: [
					{
						email: uniqueRegistry.email.value,
						apartmentNumber: communityInfo?.apartmentNumber?.value,
						block: communityInfo?.block?.value,
					},
				],
			});

		expect(inviteNewCommunityMemberResponse.statusCode).toEqual(201);

		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send({
				name: 'John Doe',
				email: uniqueRegistry.email.value,
				password: '12345678',
				condominiumHumanReadableId: condominiumInfos.humanReadableId,
			});

		expect(createUserResponse.statusCode).toEqual(201);
		expect(typeof createUserResponse.body?.accessToken).toEqual('string');
		expect(
			typeof createUserResponse.headers['set-cookie'][0]?.split(
				'refresh-token=',
			)[1],
		).toEqual('string');
	});

	it('should be able to create a user and return 202', async () => {
		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send({
				name: 'John Doe',
				email: 'user@email.com',
				password: '12345678',
				condominiumHumanReadableId: condominiumInfos.humanReadableId,
			});

		expect(createUserResponse.statusCode).toEqual(202);
		expect(typeof createUserResponse.body?.accessToken).toEqual('string');
		expect(
			typeof createUserResponse.headers['set-cookie'][0]?.split(
				'refresh-token=',
			)[1],
		).toEqual('string');
	});

	it('should be able to throw 400', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send();

		expect(response.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
		expect(response.body?.statusCode).toEqual(400);
	});

	it('should be able to throw 404', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.createUser)
			.set('content-type', 'application/json')
			.send({
				name: 'New User',
				email: 'user@email.com',
				password: '12345678',
				condominiumHumanReadableId: '123456',
			});

		expect(response.statusCode).toEqual(404);
		expect(response.body?.message).toEqual(
			'O conteúdo solicitado não foi encontrado',
		);
		expect(response.body?.statusCode).toEqual(404);
	});

	it('should be able to throw 409 because user is already exist', async () => {
		const uniqueRegistry = uniqueRegistryFactory({
			email: 'user@email.com',
		});

		const call = async () =>
			await request(app.getHttpServer())
				.post(endpoints.createUser)
				.set('content-type', 'application/json')
				.send({
					name: 'New User',
					email: uniqueRegistry.email.value,
					password: '12345678',
					condominiumHumanReadableId:
						condominiumInfos.humanReadableId,
				});

		await call();
		const response = await call();

		expect(response.statusCode).toEqual(409);
		expect(response.body?.statusCode).toEqual(409);
		expect(response.body?.message).toEqual('Conteúdo já existe');
	});
});
