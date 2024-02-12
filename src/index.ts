import { LoggerAdapter } from '@app/adapters/logger';
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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseCustomErrorFilter } from '@infra/http/filters/errors/databaseCustomError.filter';
import { PrismaErrorFilter } from '@infra/http/filters/errors/prisma.filter';
import { RedisErrorFilter } from '@infra/http/filters/errors/redis-login.filter';
import { HealthCheckErrorFilter } from '@infra/http/filters/errors/healthCheckError.filter';
import { AxiosCheckErrorFilter } from '@infra/http/filters/errors/serviceUnavailableException.filter';

export class RegistryAPIBootstrap {
	private app: NestExpressApplication;
	private logger: LoggerAdapter;

	private async build() {
		this.app = await NestFactory.create<NestExpressApplication>(AppModule, {
			bufferLogs: true,
		});

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

	async start() {
		await this.build();

		this.setGlobalInteceptors();
		this.setGlobalPipes();
		this.setGlobalFilters();

		const PORT = process.env.PORT ?? 3000;
		await this.app.listen(PORT);
	}
}

const app = new RegistryAPIBootstrap();

app.start();
