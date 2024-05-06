import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { UserWriteOps } from '@app/repositories/user/write';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { KeysEnum } from '@app/repositories/key';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { UUID } from '@app/entities/VO';

describe('Delete condominium E2E', () => {
	let app: INestApplication;
	let createUserRepo: UserWriteOps.Create;
	let genTFA: GenTFAService;
	let genTokens: CreateTokenService;

	const endpoints = {
		createCondominium: '/condominium',
		createUser: '/user',
		delete: (id?: string) => `/condominium/${id}`,
	};

	beforeAll(async () => {
		app = await startApplication();
		createUserRepo = app.get(UserWriteOps.Create);
		genTFA = app.get(GenTFAService);
		genTokens = app.get(CreateTokenService);
	});

	afterAll(async () => await app.close());

	it('should be able to delete a condominium', async () => {
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

		const id = createCondominiumResponse.body?.condominium?.id;

		const deleteCondominiumReponse = await request(app.getHttpServer())
			.delete(endpoints.delete(id))
			.set('authorization', `Bearer ${tokens.accessToken}`);

		expect(deleteCondominiumReponse.statusCode).toEqual(204);

		const readMyCondominiumData = await request(app.getHttpServer())
			.get('/condominium/my')
			.set('authorization', `Bearer ${tokens.accessToken}`);

		expect(readMyCondominiumData.statusCode).toEqual(200);
		expect(readMyCondominiumData.body?.condominiums.length).toEqual(0);
	});

	it('should be able to throw 400 because condominium id is malformed', async () => {
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();
		await createUserRepo.exec({ user, uniqueRegistry });

		const tokens = await genTokens.exec({ user, uniqueRegistry });

		const deleteCondominiumReponse = await request(app.getHttpServer())
			.delete(endpoints.delete())
			.set('authorization', `Bearer ${tokens.accessToken}`);

		expect(deleteCondominiumReponse.statusCode).toEqual(400);
		expect(deleteCondominiumReponse.body?.statusCode).toEqual(400);
		expect(deleteCondominiumReponse.body?.message).toBeInstanceOf(Array);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const deleteCondominiumReponse = await request(
			app.getHttpServer(),
		).delete(endpoints.delete(UUID.genV4().value));
		expect(deleteCondominiumReponse.statusCode).toEqual(401);
		expect(deleteCondominiumReponse.body?.statusCode).toEqual(401);
		expect(deleteCondominiumReponse.body?.message).toEqual(
			'Acesso não autorizado',
		);
	});
});
