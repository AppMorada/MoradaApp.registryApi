import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { LogInterceptor } from '@infra/http/interceptors/logger.interceptor';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { GenericErrorFilter } from '@infra/http/filters/errors/generic.filter';
import { ServiceErrorFilter } from '@infra/http/filters/errors/services.filter';
import { EntitieErrorFilter } from '@infra/http/filters/errors/vo.filter';
import { GatewayErrorFilter } from '@infra/http/filters/errors/gateways.filter';
import { GuardErrorFilter } from '@infra/http/filters/errors/guard.filter';
import { AdapterErrorFilter } from '@infra/http/filters/errors/adapter.filter';
import { ClassValidatorErrorFilter } from '@infra/http/filters/errors/classValidator.filter';
import { ThrottlerErrorFilter } from '@infra/http/filters/errors/throttler.filter';
import { NotFoundFilter } from '@infra/http/filters/errors/notFound.filter';
import { DatabaseCustomErrorFilter } from '@infra/http/filters/errors/databaseCustomError.filter';
import { HealthCheckErrorFilter } from '@infra/http/filters/errors/healthCheckError.filter';
import { AxiosCheckErrorFilter } from '@infra/http/filters/errors/serviceUnavailableException.filter';
import { FirestoreCustomErrorFilter } from '@infra/http/filters/errors/firestoreCustomError.filter';
import { EnvEnum, GetEnvService } from '@infra/configs/env/getEnv.service';
import { TypeORMErrorFilter } from '@infra/http/filters/errors/typeorm.filter';
import { UnprocessableEntityFilter } from '@infra/http/filters/errors/unprocessableEntity.filter';
import oas from '../docs/openapi/openapi.json';
import * as swaggerUi from 'swagger-ui-express';
import { ReportAdapter } from '@app/adapters/reports';
import { TraceHandler } from '@infra/configs/tracing';

export class RegistryAPIBootstrap {
	app: NestExpressApplication;
	logger: LoggerAdapter;
	report: ReportAdapter;
	envManager: GetEnvService;

	constructor(private readonly trace: TraceHandler) {}

	private async build() {
		this.trace.start();
		this.app = await NestFactory.create<NestExpressApplication>(AppModule, {
			bufferLogs: true,
		});

		this.app.enableShutdownHooks();
		this.app.enableCors({
			origin: '*', // mudar no futuro
			methods: ['DELETE', 'POST', 'PATCH', 'PUT', 'GET'],
		});

		this.logger = this.app.get(LoggerAdapter);
		this.envManager = this.app.get(GetEnvService);
		this.report = this.app.get(ReportAdapter);

		const { env: COOKIE_KEY } = await this.envManager.exec({
			env: EnvEnum.COOKIE_KEY,
		});
		this.app.use(cookieParser(COOKIE_KEY));

		const express = this.app.getHttpAdapter();
		express.use('/api', swaggerUi.serve as any);
		express.get('/api', swaggerUi.setup(oas));

		process.on('SIGTERM', () => {
			this.logger.info({
				name: 'SIGTERM',
				description:
					'SIGTERM recebido, finalizando a aplicação de maneira segura',
				layer: LayersEnum.nodeInternal,
			});

			process.exit(1);
		});
	}

	private setGlobalInteceptors() {
		this.app.useGlobalInterceptors(new LogInterceptor(this.logger));
	}

	private setGlobalPipes() {
		this.app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
			}),
		);
	}

	private setGlobalFilters() {
		this.app.useGlobalFilters(
			new GenericErrorFilter(this.logger, this.report),
		);
		this.app.useGlobalFilters(new HealthCheckErrorFilter(this.report));
		this.app.useGlobalFilters(
			new AxiosCheckErrorFilter(this.logger, this.report),
		);
		this.app.useGlobalFilters(
			new TypeORMErrorFilter(this.logger, this.report, this.trace),
		);
		this.app.useGlobalFilters(new FirestoreCustomErrorFilter());
		this.app.useGlobalFilters(
			new DatabaseCustomErrorFilter(this.logger, this.report),
		);
		this.app.useGlobalFilters(
			new ServiceErrorFilter(this.logger, this.report),
		);
		this.app.useGlobalFilters(
			new EntitieErrorFilter(this.logger, this.report),
		);
		this.app.useGlobalFilters(
			new GatewayErrorFilter(this.logger, this.report),
		);
		this.app.useGlobalFilters(new GuardErrorFilter(this.logger));
		this.app.useGlobalFilters(
			new AdapterErrorFilter(this.logger, this.report),
		);
		this.app.useGlobalFilters(new ClassValidatorErrorFilter(this.logger));
		this.app.useGlobalFilters(new ThrottlerErrorFilter(this.logger));
		this.app.useGlobalFilters(new NotFoundFilter(this.logger));
		this.app.useGlobalFilters(new UnprocessableEntityFilter(this.logger));
	}

	async start() {
		await this.build();

		this.setGlobalPipes();
		this.setGlobalInteceptors();
		this.setGlobalFilters();

		const { env: PORT } = await this.envManager.exec({ env: EnvEnum.PORT });
		await this.app.listen(PORT ?? 3000);
	}
}
