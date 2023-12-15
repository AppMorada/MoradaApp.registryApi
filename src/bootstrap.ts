import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { NestFactory } from '@nestjs/core';
import {
	ExpressAdapter,
	NestExpressApplication,
} from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from './app.module';
import { LogInterceptor } from '@infra/http/interceptors/logger.interceptor';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { GenericErrorFilter } from '@infra/http/filters/errors/generic.filter';
import { PrismaErrorFilter } from '@infra/http/filters/errors/prisma.filter';
import { RedisErrorFilter } from '@infra/http/filters/errors/redis-logic.filter';
import { ServiceErrorFilter } from '@infra/http/filters/errors/services.filter';
import { EntitieErrorFilter } from '@infra/http/filters/errors/vo.filter';
import { GatewayErrorFilter } from '@infra/http/filters/errors/gateways.filter';
import { GuardErrorFilter } from '@infra/http/filters/errors/guard.filter';
import { AdapterErrorFilter } from '@infra/http/filters/errors/adapter.filter';
import { ClassValidatorErrorFilter } from '@infra/http/filters/errors/classValidator.filter';
import { ThrottlerErrorFilter } from '@infra/http/filters/errors/throttler.filter';
import { NotFoundFilter } from '@infra/http/filters/errors/notFound.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisService } from '@infra/storages/cache/redis/redis.service';
import { PrismaService } from '@infra/storages/db/prisma/prisma.service';

interface IProps {
	requestListener: express.Express;
}

export class Bootstrap {
	private app: NestExpressApplication;
	private logger: LoggerAdapter;

	private async build(requestListener: express.Express) {
		this.app = await NestFactory.create<NestExpressApplication>(
			AppModule,
			new ExpressAdapter(requestListener),
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
		this.app.useGlobalFilters(new PrismaErrorFilter(this.logger));
		this.app.useGlobalFilters(new RedisErrorFilter(this.logger));
		this.app.useGlobalFilters(new ServiceErrorFilter(this.logger));
		this.app.useGlobalFilters(new EntitieErrorFilter(this.logger));
		this.app.useGlobalFilters(new GatewayErrorFilter(this.logger));
		this.app.useGlobalFilters(new GuardErrorFilter(this.logger));
		this.app.useGlobalFilters(new AdapterErrorFilter(this.logger));
		this.app.useGlobalFilters(new ClassValidatorErrorFilter(this.logger));
		this.app.useGlobalFilters(new ThrottlerErrorFilter(this.logger));
		this.app.useGlobalFilters(new NotFoundFilter(this.logger));
	}

	async run(input: IProps) {
		await this.build(input.requestListener);
		this.setGlobalInteceptors();
		this.setGlobalPipes();
		this.setGlobalFilters();

		await this.app.init();
	}

	async runStorageLayer() {
		const redis = this.app.get(RedisService);
		const prisma = this.app.get(PrismaService);

		await prisma.init();
		await redis.init();
	}

	async disconnectStorageLayer() {
		this.logger.info({
			layer: LayersEnum.start,
			name: 'Stopping function',
			description: 'Stopping every storage layer in Registry API!',
		});

		const redis = this.app.get(RedisService);
		const prisma = this.app.get(PrismaService);

		await prisma.close();
		await redis.close();
	}
}
