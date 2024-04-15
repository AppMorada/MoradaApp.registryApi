import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import { condominiumFactory } from '@tests/factories/condominium';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { UserRepoWriteOps } from '@app/repositories/user/write';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { KeysEnum } from '@app/repositories/key';

describe('Create condominium E2E', () => {
	let app: INestApplication;
	let userRepo: UserRepoWriteOps;
	let genTFA: GenTFAService;

	const endpoints = {
		createCondominium: '/condominium',
		createUser: '/user',
	};

	beforeAll(async () => {
		app = await startApplication();
		userRepo = app.get(UserRepoWriteOps);
		genTFA = app.get(GenTFAService);
	});

	afterAll(async () => await app.close());

	it('should be able to create a condominium', async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		await userRepo.create({ user, uniqueRegistry });
		const { code } = await genTFA.exec({
			existentUserContent: { user, uniqueRegistry },
			keyName: KeysEnum.CONDOMINIUM_VALIDATION_KEY,
		});

		const response = await request(app.getHttpServer())
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

		expect(response.statusCode).toEqual(201);

		expect(typeof response.body?.condominium?.id).toEqual('string');
		expect(typeof response.body?.condominium?.humanReadableId).toEqual(
			'string',
		);
		expect(typeof response.body?.condominium?.ownerId).toEqual('string');
		expect(typeof response.body?.condominium?.createdAt).toEqual('string');
		expect(typeof response.body?.condominium?.updatedAt).toEqual('string');

		expect(response.body?.condominium?.name).toEqual(
			condominium.name.value,
		);
		expect(response.body?.condominium?.CEP).toEqual(condominium.CEP.value);
		expect(response.body?.condominium?.num).toEqual(condominium.num.value);
		expect(response.body?.condominium?.CNPJ).toEqual(
			condominium.CNPJ.value,
		);
		expect(response.body?.condominium?.district).toEqual(
			condominium.district.value,
		);
		expect(response.body?.condominium?.city).toEqual(
			condominium.city.value,
		);
		expect(response.body?.condominium?.state).toEqual(
			condominium.state.value,
		);
		expect(response.body?.condominium?.reference).toEqual(
			condominium?.reference?.value,
		);
		expect(response.body?.condominium?.complement).toEqual(
			condominium?.complement?.value,
		);
	});

	it('should be able to throw a 400', async () => {
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		await userRepo.create({ user, uniqueRegistry });
		const { code } = await genTFA.exec({
			existentUserContent: { user, uniqueRegistry },
			keyName: KeysEnum.CONDOMINIUM_VALIDATION_KEY,
		});

		const response = await request(app.getHttpServer())
			.post(endpoints.createCondominium)
			.set('authorization', `Bearer ${code}`)
			.send();

		expect(response.statusCode).toEqual(400);
		expect(response.body?.message).toBeInstanceOf(Array);
		expect(response.body?.statusCode).toEqual(400);
	});

	it('should be able to throw a 401 - user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.post(endpoints.createCondominium)
			.send();

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});

	it('should be able to throw a 409 because condominium already exists', async () => {
		const condominium = condominiumFactory();
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		await userRepo.create({ user, uniqueRegistry });
		const { code } = await genTFA.exec({
			existentUserContent: { user, uniqueRegistry },
			keyName: KeysEnum.CONDOMINIUM_VALIDATION_KEY,
		});

		const call = async () =>
			await request(app.getHttpServer())
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

		await call();
		const response = await call();

		expect(response.statusCode).toEqual(409);
		expect(response.body?.statusCode).toEqual(409);
		expect(response.body?.message).toEqual('Conteúdo já existe');
	});
});
