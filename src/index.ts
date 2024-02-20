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
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseCustomErrorFilter } from '@infra/http/filters/errors/databaseCustomError.filter';
import { RedisErrorFilter } from '@infra/http/filters/errors/redis-login.filter';
import { HealthCheckErrorFilter } from '@infra/http/filters/errors/healthCheckError.filter';
import { AxiosCheckErrorFilter } from '@infra/http/filters/errors/serviceUnavailableException.filter';
import { FirestoreCustomErrorFilter } from '@infra/http/filters/errors/firestoreCustomError.filter';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';
import { TypeORMErrorFilter } from '@infra/http/filters/errors/typeorm.filter';

export class RegistryAPIBootstrap {
	private app: NestExpressApplication;
	private logger: LoggerAdapter;
	private envManager: GetEnvService;

	private async build() {
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

		const { env: COOKIE_KEY } = await this.envManager.exec({
			env: EnvEnum.COOKIE_KEY,
		});
		this.app.use(cookieParser(COOKIE_KEY));

		const config = new DocumentBuilder()
			.setTitle('MoradaApp: Registry API')
			.setDescription('Morada App Registry API')
			.setVersion('1.0')
			.addTag('moradaApp')
			.build();

		const document = SwaggerModule.createDocument(this.app, config);
		SwaggerModule.setup('api', this.app, document);

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
		this.app.useGlobalFilters(new GenericErrorFilter(this.logger));
		this.app.useGlobalFilters(new HealthCheckErrorFilter());
		this.app.useGlobalFilters(new AxiosCheckErrorFilter(this.logger));
		this.app.useGlobalFilters(new RedisErrorFilter(this.logger));
		this.app.useGlobalFilters(new TypeORMErrorFilter(this.logger));
		this.app.useGlobalFilters(new FirestoreCustomErrorFilter(this.logger));
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

		this.setGlobalPipes();
		this.setGlobalInteceptors();
		this.setGlobalFilters();

		const { env: PORT } = await this.envManager.exec({ env: EnvEnum.PORT });
		await this.app.listen(PORT ?? 3000);
	}
}

const app = new RegistryAPIBootstrap();
app.start();
