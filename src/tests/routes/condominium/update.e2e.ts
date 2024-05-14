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

describe('Update condominium E2E', () => {
	let app: INestApplication;
	let createUserRepo: UserWriteOps.Create;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		updateCondominium: (id?: string) => `/condominium/${id}`,
		createCondominium: '/condominium',
		getCondominium: '/condominium/my',
	};

	beforeAll(async () => {
		app = await startApplication();
		createUserRepo = app.get(UserWriteOps.Create);
		genTFA = app.get(GenTFAService);
		genTokens = app.get(CreateTokenService);
	});

	afterAll(async () => await app.close());

	it('should be able to update a condominium', async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();
		await createUserRepo.exec({ user, uniqueRegistry });

		const { code } = await genTFA.exec({
			existentUserContent: { uniqueRegistry, user },
			keyName: KeysEnum.CONDOMINIUM_VALIDATION_KEY,
		});
		const tokens = await genTokens.exec({ user, uniqueRegistry });

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

		const id = createCondominiumResponse.body?.condominium?.id;

		const updateCondominiumResponse = await request(app.getHttpServer())
			.patch(endpoints.updateCondominium(id))
			.set('authorization', `Bearer ${tokens.accessToken}`)
			.send({
				name: 'New condominium name',
				CEP: '65636-678',
				num: 64512,
				district: 'New district',
				city: 'New city',
				state: 'New state',
				reference: 'New reference',
				complement: 'New complement',
			});

		expect(updateCondominiumResponse.statusCode).toEqual(200);

		const readMyCondominiumData = await request(app.getHttpServer())
			.get(endpoints.getCondominium)
			.set('authorization', `Bearer ${tokens.accessToken}`);

		const searchedCondominium = readMyCondominiumData.body?.condominiums[0];
		expect(searchedCondominium?.name).toEqual('New condominium name');
		expect(searchedCondominium?.CEP).toEqual('65636678');
		expect(searchedCondominium?.num).toEqual(64512);
		expect(searchedCondominium?.district).toEqual('New district');
		expect(searchedCondominium?.city).toEqual('New city');
		expect(searchedCondominium?.state).toEqual('New state');
		expect(searchedCondominium?.complement).toEqual('New complement');
	});

	it('should be able to throw a 400', async () => {
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();
		await createUserRepo.exec({ user, uniqueRegistry });

		const tokens = await genTokens.exec({ user, uniqueRegistry });

		const updateCondominiumResponse = await request(app.getHttpServer())
			.patch(endpoints.updateCondominium())
			.set('authorization', `Bearer ${tokens.accessToken}`)
			.send();

		expect(updateCondominiumResponse.statusCode).toEqual(400);
		expect(updateCondominiumResponse.body?.statusCode).toEqual(400);
		expect(updateCondominiumResponse.body?.message).toBeInstanceOf(Array);
	});

	it('should be able to throw a 401', async () => {
		const updateCondominiumResponse = await request(app.getHttpServer())
			.patch(endpoints.updateCondominium())
			.send();

		expect(updateCondominiumResponse.statusCode).toEqual(401);
		expect(updateCondominiumResponse.body?.statusCode).toEqual(401);
		expect(updateCondominiumResponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
