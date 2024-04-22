import { INestApplication } from '@nestjs/common';
import { startApplication } from '../app';
import request from 'supertest';
import { userFactory } from '@tests/factories/user';
import { uniqueRegistryFactory } from '@tests/factories/uniqueRegistry';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { KeysEnum } from '@app/repositories/key';

describe('Change Password E2E', () => {
	let app: INestApplication;
	let genTFA: GenTFAService;

	const endpoints = {
		default: '/user',
		changePassword: '/user/change-password',
		login: '/login',
	};

	beforeEach(async () => {
		app = await startApplication();
		genTFA = app.get(GenTFAService);
	});

	afterEach(async () => await app.close());

	it('should update user password data', async () => {
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.default)
			.set('content-type', 'application/json')
			.send({
				name: user.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: uniqueRegistry.CPF?.value,
			});

		expect(createUserResponse.statusCode).toEqual(201);

		const tfaToken = await genTFA.exec({
			searchUserKey: uniqueRegistry.email,
			keyName: KeysEnum.CHANGE_PASSWORD_KEY,
		});

		const changePasswordResponse = await request(app.getHttpServer())
			.patch(endpoints.changePassword)
			.set('authorization', `Bearer ${tfaToken.code}`)
			.send({
				password: 'new password',
			});

		expect(changePasswordResponse.statusCode).toEqual(200);

		const loginResponse = await request(app.getHttpServer())
			.post(endpoints.login)
			.send({
				email: uniqueRegistry.email.value,
				password: 'new password',
			});

		expect(loginResponse.statusCode).toEqual(200);
	});

	it('should be able to throw a 400', async () => {
		const user = userFactory();
		const uniqueRegistry = uniqueRegistryFactory();

		const createUserResponse = await request(app.getHttpServer())
			.post(endpoints.default)
			.set('content-type', 'application/json')
			.send({
				name: user.name.value,
				email: uniqueRegistry.email.value,
				password: user.password.value,
				CPF: uniqueRegistry.CPF?.value,
			});

		expect(createUserResponse.statusCode).toEqual(201);

		const tfaToken = await genTFA.exec({
			searchUserKey: uniqueRegistry.email,
			keyName: KeysEnum.CHANGE_PASSWORD_KEY,
		});

		const changePasswordResponse = await request(app.getHttpServer())
			.patch(endpoints.changePassword)
			.set('authorization', `Bearer ${tfaToken.code}`)
			.send();

		expect(changePasswordResponse.statusCode).toEqual(400);
		expect(changePasswordResponse.body?.message).toBeInstanceOf(Array);
		expect(changePasswordResponse.body?.statusCode).toEqual(400);
	});

	it('should be able to throw 401 because user is not authenticated', async () => {
		const response = await request(app.getHttpServer())
			.patch(endpoints.changePassword)
			.send();

		expect(response.statusCode).toEqual(401);
		expect(response.body?.statusCode).toEqual(401);
		expect(response.body?.message).toEqual('Acesso não autorizado');
	});
});
