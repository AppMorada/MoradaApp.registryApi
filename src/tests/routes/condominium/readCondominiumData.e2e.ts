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
import { Condominium } from '@app/entities/condominium';

describe('Read condominium data E2E', () => {
	let app: INestApplication;
	let createUserRepo: UserWriteOps.Create;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	let adminToken: string | undefined;
	let condominiumOutputInfos: any;
	let condominiumInputInfos: Condominium;

	const endpoints = {
		createCondominium: '/condominium',
		createUser: '/user',
		my: () => '/condominium/my',
		publicRoute: (id?: string) => `/condominium/${id}`,
	};

	beforeAll(async () => {
		app = await startApplication();
		createUserRepo = app.get(UserWriteOps.Create);
		genTFA = app.get(GenTFAService);
		genTokens = app.get(CreateTokenService);
	});

	beforeEach(async () => {
		condominiumInputInfos = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();
		await createUserRepo.exec({ user, uniqueRegistry });

		const { code } = await genTFA.exec({
			existentUserContent: { user, uniqueRegistry },
			keyName: KeysEnum.CONDOMINIUM_VALIDATION_KEY,
		});
		const tokens = await genTokens.exec({ user, uniqueRegistry });
		adminToken = tokens.accessToken;

		const createCondominiumResponse = await request(app.getHttpServer())
			.post(endpoints.createCondominium)
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${code}`)
			.send({
				name: condominiumInputInfos.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CEP: condominiumInputInfos.CEP.value,
				num: condominiumInputInfos.num.value,
				CNPJ: condominiumInputInfos.CNPJ.value,
				district: condominiumInputInfos.district.value,
				city: condominiumInputInfos.city.value,
				state: condominiumInputInfos.state.value,
				reference: condominiumInputInfos?.reference?.value,
				complement: condominiumInputInfos?.complement?.value,
			});

		expect(createCondominiumResponse.statusCode).toEqual(201);

		condominiumOutputInfos = createCondominiumResponse.body?.condominium;
	});

	afterAll(async () => await app.close());

	it('should be able to read a condominium data - /condominium/my', async () => {
		const readMyCondominiumData = await request(app.getHttpServer())
			.get(endpoints.my())
			.set('authorization', `Bearer ${adminToken}`);

		expect(readMyCondominiumData.statusCode).toEqual(200);

		const searchedCondominium = readMyCondominiumData.body?.condominiums[0];
		expect(searchedCondominium.id).toEqual(condominiumOutputInfos?.id);
		expect(searchedCondominium?.humanReadableId).toEqual(
			condominiumOutputInfos?.humanReadableId,
		);
		expect(searchedCondominium.name).toEqual(condominiumOutputInfos?.name);
		expect(searchedCondominium.CEP).toEqual(condominiumOutputInfos?.CEP);
		expect(searchedCondominium.CNPJ).toEqual(condominiumOutputInfos?.CNPJ);

		expect(searchedCondominium.createdAt).toEqual(
			condominiumOutputInfos?.createdAt,
		);
		expect(searchedCondominium.updatedAt).toEqual(
			condominiumOutputInfos?.updatedAt,
		);

		expect(searchedCondominium?.id).toEqual(condominiumOutputInfos?.id);
		expect(searchedCondominium?.humanReadableId).toEqual(
			condominiumOutputInfos?.humanReadableId,
		);
		expect(searchedCondominium?.ownerId).toEqual(
			condominiumOutputInfos?.ownerId,
		);
		expect(searchedCondominium?.createdAt).toEqual(
			condominiumOutputInfos?.createdAt,
		);
		expect(searchedCondominium?.updatedAt).toEqual(
			condominiumOutputInfos?.updatedAt,
		);

		expect(searchedCondominium?.name).toEqual(
			condominiumInputInfos.name.value,
		);
		expect(searchedCondominium?.CEP).toEqual(
			condominiumInputInfos.CEP.value,
		);
		expect(searchedCondominium?.num).toEqual(
			condominiumInputInfos.num.value,
		);
		expect(searchedCondominium?.CNPJ).toEqual(
			condominiumInputInfos.CNPJ.value,
		);
		expect(searchedCondominium?.district).toEqual(
			condominiumInputInfos.district.value,
		);
		expect(searchedCondominium?.city).toEqual(
			condominiumInputInfos.city.value,
		);
		expect(searchedCondominium?.state).toEqual(
			condominiumInputInfos.state.value,
		);
		expect(searchedCondominium?.reference).toEqual(
			condominiumInputInfos?.reference?.value,
		);
		expect(searchedCondominium?.complement).toEqual(
			condominiumInputInfos?.complement?.value,
		);
	});

	it('should be able to read a condominium - /condominium/id', async () => {
		const readMyCondominiumData = await request(app.getHttpServer()).get(
			endpoints.publicRoute(condominiumOutputInfos?.id),
		);

		const searchedCondominium = readMyCondominiumData.body?.data;
		expect(readMyCondominiumData.statusCode).toEqual(200);

		expect(searchedCondominium.id).toEqual(condominiumOutputInfos?.id);
		expect(searchedCondominium?.humanReadableId).toEqual(
			condominiumOutputInfos?.humanReadableId,
		);
		expect(searchedCondominium.name).toEqual(condominiumOutputInfos?.name);
		expect(searchedCondominium.CEP).toEqual(condominiumOutputInfos?.CEP);
		expect(searchedCondominium.CNPJ).toEqual(condominiumOutputInfos?.CNPJ);

		expect(searchedCondominium.createdAt).toEqual(
			condominiumOutputInfos?.createdAt,
		);
		expect(searchedCondominium.updatedAt).toEqual(
			condominiumOutputInfos?.updatedAt,
		);

		expect(searchedCondominium?.id).toEqual(condominiumOutputInfos?.id);
		expect(searchedCondominium?.humanReadableId).toEqual(
			condominiumOutputInfos?.humanReadableId,
		);
		expect(searchedCondominium?.ownerId).toEqual(
			condominiumOutputInfos?.ownerId,
		);
		expect(searchedCondominium?.createdAt).toEqual(
			condominiumOutputInfos?.createdAt,
		);
		expect(searchedCondominium?.updatedAt).toEqual(
			condominiumOutputInfos?.updatedAt,
		);

		expect(searchedCondominium?.name).toEqual(
			condominiumInputInfos.name.value,
		);
		expect(searchedCondominium?.CEP).toEqual(
			condominiumInputInfos.CEP.value,
		);
		expect(searchedCondominium?.num).toEqual(
			condominiumInputInfos.num.value,
		);
		expect(searchedCondominium?.CNPJ).toEqual(
			condominiumInputInfos.CNPJ.value,
		);
		expect(searchedCondominium?.district).toEqual(
			condominiumInputInfos.district.value,
		);
		expect(searchedCondominium?.city).toEqual(
			condominiumInputInfos.city.value,
		);
		expect(searchedCondominium?.state).toEqual(
			condominiumInputInfos.state.value,
		);
		expect(searchedCondominium?.reference).toEqual(
			condominiumInputInfos?.reference?.value,
		);
		expect(searchedCondominium?.complement).toEqual(
			condominiumInputInfos?.complement?.value,
		);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const readMyCondominiumData = await request(app.getHttpServer()).get(
			endpoints.my(),
		);

		expect(readMyCondominiumData.statusCode).toEqual(401);
		expect(readMyCondominiumData.body?.statusCode).toEqual(401);
		expect(readMyCondominiumData.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});

	it('should be able to throw 400 because condominium id is malformed', async () => {
		const readMyCondominiumData = await request(app.getHttpServer()).get(
			endpoints.publicRoute(),
		);

		expect(readMyCondominiumData.statusCode).toEqual(400);
		expect(readMyCondominiumData.body?.statusCode).toEqual(400);
		expect(readMyCondominiumData.body?.message).toBeInstanceOf(Array);
	});
});
