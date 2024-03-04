import { AuthModule } from '@app/auth/auth.module';
import { ConfigModule } from '@infra/configs/config.module';
import { EventsModule } from '@infra/events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { UserModule } from '../index.module';
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
import { CondominiumModule } from '../../condominium/index.module';
import { UnprocessableEntityFilter } from '@infra/http/filters/errors/unprocessableEntity.filter';
import { LoginModule } from '../../login/index.module';
import { EnterpriseMemberModule } from '../../enterpriseMember/index.module';

describe('Get user with enterprise member section E2E test', () => {
	let sut: INestApplication;

	const endpoint = '/user/me/enterprise-user-section';

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
				EnterpriseMemberModule,
				UserModule,
				LoginModule,
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
		sut.useGlobalFilters(new UnprocessableEntityFilter(logger));

		await sut.init();
	});

	afterAll(async () => await sut.close());

	it('should get a user', async () => {
		const user = userFactory();
		const condominium = condominiumFactory();

		const res = await supertest(sut.getHttpServer())
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

		await supertest(sut.getHttpServer())
			.post(`/condominium/${res.body?.condominium?.id}/enterprise-user`)
			.set('content-type', 'application/json')
			.set('authorization', `Bearer ${res.body?.accessToken}`)
			.send({
				name: 'new user',
				email: 'newemail@email.com',
				password: '12345678',
				CPF: '488.748.854-82',
			});

		const res1 = await supertest(sut.getHttpServer())
			.post('/login')
			.set('set-content', 'application/json')
			.send({
				email: 'newemail@email.com',
				password: '12345678',
			});

		const res2 = await supertest(sut.getHttpServer())
			.get(endpoint)
			.set('authorization', `Bearer ${res1.body?.accessToken}`);

		expect(res2.statusCode).toEqual(200);
		expect(typeof res2.body?.id).toEqual('string');
		expect(typeof res2.body?.name).toEqual('string');
		expect(res2.body?.phoneNumber).toBeNull();
		expect(typeof res2.body?.CPF).toEqual('string');
		expect(typeof res2.body?.email).toEqual('string');
		expect(typeof res2.body?.createdAt).toEqual('string');
		expect(typeof res2.body?.updatedAt).toEqual('string');
		expect(typeof res2.body?.works_on?.id).toEqual('string');
		expect(typeof res2.body?.works_on?.condominiumId).toEqual('string');
		expect(typeof res2.body?.works_on?.hierarchy).toEqual('number');
		expect(typeof res2.body?.works_on?.createdAt).toEqual('string');
		expect(typeof res2.body?.works_on?.updatedAt).toEqual('string');
	}, 12000);

	it('should be able to throw a 401 error', async () => {
		const res1 = await supertest(sut.getHttpServer())
			.get(endpoint)
			.set('content-type', 'application/json');

		expect(res1.statusCode).toEqual(401);
		expect(res1.body?.statusCode).toEqual(401);
		expect(res1.body?.message).toEqual('Acesso não autorizado');
	});
});
