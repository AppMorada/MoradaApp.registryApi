import { AuthModule } from '@app/auth/auth.module';
import { ConfigModule } from '@infra/configs/config.module';
import { EventsModule } from '@infra/events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { CondominiumModule } from '../index.module';
import { CacheModule } from '@nestjs/cache-manager';
import { NestjsCacheModule } from '@infra/storages/cache/nestjs/nestjs.module';
import { FirestoreModule } from '@infra/storages/db/firestore/firestore.module';
import { CustomTypeOrmModule } from '@infra/storages/db/typeorm/typeorm.module';
import { AdaptersModule } from '@app/adapters/adapter.module';
import { GatewayModule } from '@infra/gateways/gateway.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { LoggerAdapter } from '@app/adapters/logger';
import { LogInterceptor } from '@infra/http/interceptors/logger.interceptor';
import { GenericErrorFilter } from '@infra/http/filters/errors/generic.filter';
import { HealthCheckErrorFilter } from '@infra/http/filters/errors/healthCheckError.filter';
import { TypeORMErrorFilter } from '@infra/http/filters/errors/typeorm.filter';
import { FirestoreCustomErrorFilter } from '@infra/http/filters/errors/firestoreCustomError.filter';
import { DatabaseCustomErrorFilter } from '@infra/http/filters/errors/databaseCustomError.filter';
import { ServiceErrorFilter } from '@infra/http/filters/errors/services.filter';
import { EntitieErrorFilter } from '@infra/http/filters/errors/vo.filter';
import { GatewayErrorFilter } from '@infra/http/filters/errors/gateways.filter';
import { GuardErrorFilter } from '@infra/http/filters/errors/guard.filter';
import { AdapterErrorFilter } from '@infra/http/filters/errors/adapter.filter';
import { ClassValidatorErrorFilter } from '@infra/http/filters/errors/classValidator.filter';
import { ThrottlerErrorFilter } from '@infra/http/filters/errors/throttler.filter';
import { NotFoundFilter } from '@infra/http/filters/errors/notFound.filter';
import { condominiumFactory } from '@tests/factories/condominium';
import * as supertest from 'supertest';
import { userFactory } from '@tests/factories/user';
import * as cookieParser from 'cookie-parser';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';

describe('Get condominium E2E test', () => {
	let sut: INestApplication;
	const endpoints = (id: string) => ({
		getMy: '/condominium/my',
		getById: `/condominium/${id}`,
	});

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule,
				EventEmitterModule.forRoot({
					wildcard: false,
					delimiter: '.',
					newListener: false,
					removeListener: false,
					maxListeners: 10,
					verboseMemoryLeak: true,
					ignoreErrors: false,
				}),
				EventsModule,
				AuthModule,
				CondominiumModule,
				CacheModule.register({
					isGlobal: true,
				}),
				NestjsCacheModule,
				FirestoreModule,
				CustomTypeOrmModule,
				AdaptersModule,
				GatewayModule,
			],
		}).compile();

		sut = moduleRef.createNestApplication({
			bufferLogs: true,
		});
		sut.enableShutdownHooks();
		sut.enableCors({
			origin: '*',
			methods: ['DELETE', 'POST', 'PATCH', 'PUT', 'GET'],
		});

		const envManager = sut.get(GetEnvService);
		const { env: COOKIE_KEY } = await envManager.exec({
			env: EnvEnum.COOKIE_KEY,
		});
		sut.use(cookieParser(COOKIE_KEY));

		sut.useGlobalPipes(
			new ValidationPipe({
				transform: true,
			}),
		);

		const logger = sut.get(LoggerAdapter);
		sut.useGlobalInterceptors(new LogInterceptor(logger));

		sut.useGlobalFilters(new GenericErrorFilter(logger));
		sut.useGlobalFilters(new HealthCheckErrorFilter());
		sut.useGlobalFilters(new TypeORMErrorFilter(logger));
		sut.useGlobalFilters(new FirestoreCustomErrorFilter(logger));
		sut.useGlobalFilters(new DatabaseCustomErrorFilter(logger));
		sut.useGlobalFilters(new ServiceErrorFilter(logger));
		sut.useGlobalFilters(new EntitieErrorFilter(logger));
		sut.useGlobalFilters(new GatewayErrorFilter(logger));
		sut.useGlobalFilters(new GuardErrorFilter(logger));
		sut.useGlobalFilters(new AdapterErrorFilter(logger));
		sut.useGlobalFilters(new ClassValidatorErrorFilter(logger));
		sut.useGlobalFilters(new ThrottlerErrorFilter(logger));
		sut.useGlobalFilters(new NotFoundFilter(logger));

		await sut.init();
	});

	afterAll(async () => await sut.close());

	it('should update a condominium', async () => {
		const user = userFactory();
		const condominium = condominiumFactory();
		const res1 = await supertest(sut.getHttpServer())
			.post('/condominium')
			.set('content-type', 'application/json')
			.send({
				userName: user.name.value,
				condominiumName: condominium.name.value,
				email: user.email.value,
				CPF: user.CPF.value,
				password: user.password.value,
				CEP: condominium.CEP.value,
				num: condominium.num.value,
				CNPJ: condominium.CNPJ.value,
			});

		const { getMy, getById } = endpoints(res1.body?.condominium?.id);
		const res2 = await supertest(sut.getHttpServer()).get(getById);

		expect(res2.statusCode).toEqual(200);
		expect(typeof res2.body?.data?.id).toEqual('string');
		expect(typeof res2.body?.data?.ownerId).toEqual('string');
		expect(res2.body?.data?.name).toEqual(condominium.name.value);
		expect(res2.body?.data?.CEP).toEqual(condominium.CEP.value);
		expect(res2.body?.data?.num).toEqual(condominium.num.value);
		expect(res2.body?.data?.CNPJ).toEqual(condominium.CNPJ.value);
		expect(typeof res2.body?.data?.seedKey).toEqual('string');
		expect(typeof res2.body?.data?.createdAt).toEqual('string');
		expect(typeof res2.body?.data?.updatedAt).toEqual('string');

		const res3 = await supertest(sut.getHttpServer())
			.get(getMy)
			.set('authorization', `Bearer ${res1.body?.accessToken}`);

		expect(res3.statusCode).toEqual(200);
		expect(typeof res3.body?.condominiums?.[0]?.id).toEqual('string');
		expect(res3.body?.condominiums?.[0]?.name).toEqual(
			condominium.name.value,
		);
		expect(res3.body?.condominiums?.[0]?.CEP).toEqual(
			condominium.CEP.value,
		);
		expect(res3.body?.condominiums?.[0]?.num).toEqual(
			condominium.num.value,
		);
		expect(res3.body?.condominiums?.[0]?.CNPJ).toEqual(
			condominium.CNPJ.value,
		);
		expect(typeof res3.body?.condominiums?.[0]?.seedKey).toEqual('string');
		expect(typeof res3.body?.condominiums?.[0]?.createdAt).toEqual(
			'string',
		);
		expect(typeof res3.body?.condominiums?.[0]?.updatedAt).toEqual(
			'string',
		);
	});

	it('should be able to throw a 401 error', async () => {
		const user = userFactory();
		const condominium = condominiumFactory();
		const res1 = await supertest(sut.getHttpServer())
			.post('/condominium')
			.set('content-type', 'application/json')
			.send({
				userName: user.name.value,
				condominiumName: condominium.name.value,
				email: user.email.value,
				CPF: user.CPF.value,
				password: user.password.value,
				CEP: condominium.CEP.value,
				num: condominium.num.value,
				CNPJ: condominium.CNPJ.value,
			});

		const res2 = await supertest(sut.getHttpServer()).get(
			endpoints(res1.body?.condominium?.id).getMy,
		);

		expect(res2.statusCode).toEqual(401);
		expect(res2.body?.statusCode).toEqual(401);
		expect(res2.body?.message).toEqual('Acesso não autorizado');
	});

	it('should be able to throw a 400 error', async () => {
		const user = userFactory();
		const condominium = condominiumFactory();

		await supertest(sut.getHttpServer())
			.post('/condominium')
			.set('content-type', 'application/json')
			.send({
				userName: user.name.value,
				condominiumName: condominium.name.value,
				email: user.email.value,
				CPF: user.CPF.value,
				password: user.password.value,
				CEP: condominium.CEP.value,
				num: condominium.num.value,
				CNPJ: condominium.CNPJ.value,
			});

		const res2 = await supertest(sut.getHttpServer()).get(
			'/condominium/wrong-uuid',
		);

		expect(res2.statusCode).toEqual(400);
		expect(res2.body?.statusCode).toEqual(400);
		expect(res2.body?.message).toBeTruthy();
	});
});
