import { LoggerAdapter } from '@registry:app/adapters/logger';
import { NestFactory } from '@nestjs/core';
import {
	ExpressAdapter,
	NestExpressApplication,
} from '@nestjs/platform-express';
import express, { Express } from 'express';
import { AppModule } from './app.module';
import { LogInterceptor } from '@registry:infra/http/interceptors/logger.interceptor';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { GenericErrorFilter } from '@registry:infra/http/filters/errors/generic.filter';
import { ServiceErrorFilter } from '@registry:infra/http/filters/errors/services.filter';
import { EntitieErrorFilter } from '@registry:infra/http/filters/errors/vo.filter';
import { GatewayErrorFilter } from '@registry:infra/http/filters/errors/gateways.filter';
import { GuardErrorFilter } from '@registry:infra/http/filters/errors/guard.filter';
import { AdapterErrorFilter } from '@registry:infra/http/filters/errors/adapter.filter';
import { ClassValidatorErrorFilter } from '@registry:infra/http/filters/errors/classValidator.filter';
import { ThrottlerErrorFilter } from '@registry:infra/http/filters/errors/throttler.filter';
import { NotFoundFilter } from '@registry:infra/http/filters/errors/notFound.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseCustomErrorFilter } from '@registry:infra/http/filters/errors/databaseCustomError.filter';
import { PrismaErrorFilter } from '@registry:infra/http/filters/errors/prisma.filter';
import { RedisService } from '@registry:infra/storages/cache/redis/redis.service';
import { PrismaService } from '@registry:infra/storages/db/prisma/prisma.service';
import { RedisErrorFilter } from '@registry:infra/http/filters/errors/redis-login.filter';
import { HealthCheckErrorFilter } from '@registry:infra/http/filters/errors/healthCheckError.filter';
import { AxiosCheckErrorFilter } from '@registry:infra/http/filters/errors/serviceUnavailableException.filter';

interface IProps {
	requestListener: Express;
}

export class RegistryAPIBootstrap {
	private app: NestExpressApplication;
	private logger: LoggerAdapter;

	private async build(requestListener: express.Express) {
		this.app = await NestFactory.create<NestExpressApplication>(
			AppModule,
			new ExpressAdapter(requestListener),
			{
				bufferLogs: true,
			},
		);

		this.app.enableShutdownHooks();
		this.app.use(cookieParser(process.env.COOKIE_KEY));
		this.app.enableCors({
			origin: '*', // mudar no futuro
			methods: ['DELETE', 'POST', 'PATCH', 'PUT', 'GET'],
		});
		this.logger = this.app.get(LoggerAdapter);

		const config = new DocumentBuilder()
			.setTitle('MoradaApp: Registry API')
			.setDescription('Morada App Registry API')
			.setVersion('1.0')
			.addTag('moradaApp')
			.build();

		const document = SwaggerModule.createDocument(this.app, config);
		SwaggerModule.setup('api', this.app, document);
	}

	private setGlobalInteceptors() {
		this.app.useGlobalInterceptors(new LogInterceptor(this.logger));
	}

	private setGlobalPipes() {
		this.app.useGlobalPipes(new ValidationPipe());
	}

	private setGlobalFilters() {
		this.app.useGlobalFilters(new GenericErrorFilter(this.logger));
		this.app.useGlobalFilters(new HealthCheckErrorFilter());
		this.app.useGlobalFilters(new AxiosCheckErrorFilter(this.logger));
		this.app.useGlobalFilters(new RedisErrorFilter(this.logger));
		this.app.useGlobalFilters(new PrismaErrorFilter(this.logger));
		this.app.useGlobalFilters(new DatabaseCustomErrorFilter(this.logger));
		this.app.useGlobalFilters(new ServiceErrorFilter(this.logger));
		this.app.useGlobalFilters(new EntitieErrorFilter(this.logger));
		this.app.useGlobalFilters(new GatewayErrorFilter(this.logger));
		this.app.useGlobalFilters(new GuardErrorFilter(this.logger));
		this.app.useGlobalFilters(new AdapterErrorFilter(this.logger));
		this.app.useGlobalFilters(new ClassValidatorErrorFilter(this.logger));
		this.app.useGlobalFilters(new ThrottlerErrorFilter(this.logger));
		this.app.useGlobalFilters(new NotFoundFilter(this.logger));
	}

	async runStorageLayer() {
		const redis = this.app.get(RedisService);
		const prisma = this.app.get(PrismaService);

		await prisma.init();
		await redis.init();
	}

	async run(input: IProps) {
		await this.build(input.requestListener);
		this.setGlobalInteceptors();
		this.setGlobalPipes();
		this.setGlobalFilters();

		await this.app.init();
	}
}
