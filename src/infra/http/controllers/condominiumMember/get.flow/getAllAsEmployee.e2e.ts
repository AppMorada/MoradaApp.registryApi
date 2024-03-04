import { AuthModule } from '@app/auth/auth.module';
import { ConfigModule } from '@infra/configs/config.module';
import { EventsModule } from '@infra/events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { CondominiumMemberModule } from '../index.module';
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
import { condominiumMemberFactory } from '@tests/factories/condominiumMember';
import { CondominiumMemberRepo } from '@app/repositories/condominiumMember';
import { UUID } from '@app/entities/VO';

describe('Get all as employee condominium member E2E test', () => {
	let sut: INestApplication;
	let memberRepo: CondominiumMemberRepo;
	const endpoint = (id: string) =>
		`/condominium/${id}/as-employee/condominium-member/all`;

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
				CondominiumMemberModule,
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

		memberRepo = sut.get(CondominiumMemberRepo);
		await sut.init();
	});

	afterAll(async () => await sut.close());

	it('should get a condominium member list', async () => {
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

		expect(res.statusCode).toEqual(201);
		expect(typeof res.body?.accessToken).toEqual('string');
		expect(
			typeof res.headers['set-cookie'][0]?.split('refresh-token=')[1],
		).toEqual('string');

		expect(res.body?.condominium?.name).toEqual(condominium.name.value);
		expect(res.body?.condominium?.CEP).toEqual(condominium.CEP.value);
		expect(res.body?.condominium?.num).toEqual(condominium.num.value);
		expect(res.body?.condominium?.CNPJ).toEqual(condominium.CNPJ.value);

		const member1 = condominiumMemberFactory({
			c_email: 'member1@email.com',
			condominiumId: res.body?.condominium?.id,
		});

		await memberRepo.create({ member: member1 });

		const res1 = await supertest(sut.getHttpServer())
			.get(endpoint(res.body?.condominium?.id))
			.set('authorization', `Bearer ${res.body?.accessToken}`);

		expect(res1.statusCode).toEqual(200);
		expect(typeof res1.body?.condominiumMembers?.[0]?.id).toEqual('string');
		expect(res1.body?.condominiumMembers?.[0]?.userId).toBeNull();
		expect(typeof res1.body?.condominiumMembers?.[0]?.c_email).toEqual(
			'string',
		);
		expect(typeof res1.body?.condominiumMembers?.[0]?.block).toEqual(
			'string',
		);
		expect(
			typeof res1.body?.condominiumMembers?.[0]?.apartmentNumber,
		).toEqual('number');
		expect(typeof res1.body?.condominiumMembers?.[0]?.createdAt).toEqual(
			'string',
		);
		expect(typeof res1.body?.condominiumMembers?.[0]?.updatedAt).toEqual(
			'string',
		);
	});

	it('should be able to throw a 400 error', async () => {
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

		const member1 = condominiumMemberFactory({
			c_email: 'member1@email.com',
			condominiumId: res1.body?.condominium?.id,
		});

		await memberRepo.create({ member: member1 });

		const res2 = await supertest(sut.getHttpServer())
			.get(endpoint('wrong-uuid'))
			.set('authorization', `Bearer ${res1.body?.accessToken}`);

		expect(res2.statusCode).toEqual(400);
		expect(res2.body?.statusCode).toEqual(400);
		expect(res2.body?.message).toBeTruthy();
	});

	it('should be able to throw a 401 error', async () => {
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

		const member1 = condominiumMemberFactory({
			c_email: 'member1@email.com',
			condominiumId: res.body?.condominium?.id,
		});

		await memberRepo.create({ member: member1 });

		const res1 = await supertest(sut.getHttpServer()).get(
			endpoint(res.body?.condominium?.id),
		);

		expect(res1.statusCode).toEqual(401);
		expect(res1.body?.statusCode).toEqual(401);
		expect(res1.body?.message).toEqual('Acesso não autorizado');
	});

	it('should be able to throw a 404 error', async () => {
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

		const res2 = await supertest(sut.getHttpServer())
			.get(endpoint(UUID.genV4().value))
			.set('authorization', `Bearer ${res1.body?.accessToken}`);

		expect(res2.statusCode).toEqual(404);
		expect(res2.body?.statusCode).toEqual(404);
		expect(res2.body?.message).toEqual(
			'O conteúdo solicitado não foi encontrado',
		);
	});
});
