import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaErrorFilter } from '@infra/http/filters/errors/prisma.filter';
import { ServiceErrorFilter } from '@infra/http/filters/errors/services.filter';
import { EntitieErrorFilter } from '@infra/http/filters/errors/vo.filter';
import { GatewayErrorFilter } from '@infra/http/filters/errors/gateways.filter';
import { RedisErrorFilter } from '@infra/http/filters/errors/redis-logic.filter';
import { GuardErrorFilter } from '@infra/http/filters/errors/guard.filter';
import { AdapterErrorFilter } from '@infra/http/filters/errors/adapter.filter';
import { GenericErrorFilter } from '@infra/http/filters/errors/generic.filter';
import { ClassValidatorErrorFilter } from '@infra/http/filters/errors/classValidator.filter';
import { Echo } from 'echoguard';
import { LogInterceptor } from '@infra/http/interceptors/logger.interceptor';
import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { NotFoundFilter } from '@infra/http/filters/errors/notFound.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app: NestExpressApplication =
		await NestFactory.create<NestExpressApplication>(AppModule);

	app.enableShutdownHooks();
	app.use(cookieParser(process.env.COOKIE_KEY));

	const logger = app.get(LoggerAdapter);
	Echo.start({ appName: 'MoradaApp', server: app });

	app.useGlobalInterceptors(new LogInterceptor(logger));
	app.useGlobalPipes(new ValidationPipe());

	app.useGlobalFilters(new GenericErrorFilter(logger));

	app.useGlobalFilters(new PrismaErrorFilter(logger));
	app.useGlobalFilters(new RedisErrorFilter(logger));

	app.useGlobalFilters(new ServiceErrorFilter(logger));
	app.useGlobalFilters(new EntitieErrorFilter(logger));
	app.useGlobalFilters(new GatewayErrorFilter(logger));
	app.useGlobalFilters(new GuardErrorFilter(logger));
	app.useGlobalFilters(new AdapterErrorFilter(logger));

	app.useGlobalFilters(new ClassValidatorErrorFilter(logger));
	app.useGlobalFilters(new NotFoundFilter(logger));

	app.enableCors({
		origin: '*', // mudar no futuro
		methods: ['DELETE', 'POST', 'PATCH', 'PUT', 'GET'],
	});

	const config = new DocumentBuilder()
		.setTitle('MoradaApp: back-end')
		.setDescription('Morada app back-end API')
		.setVersion('1.0')
		.addTag('moradaApp')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(process.env.PORT || 3000).then(() => {
		if (process.env.NODE_ENV === 'production')
			logger.info({
				name: 'Servidor online!',
				description: 'Tudo em ordem com o estado interno do servidor!',
				layer: LayersEnum.start,
			});
	});
}
bootstrap();
