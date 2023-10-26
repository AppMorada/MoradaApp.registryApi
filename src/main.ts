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

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.enableShutdownHooks();

	app.useGlobalPipes(new ValidationPipe());

	app.useGlobalFilters(new GenericErrorFilter());

	app.useGlobalFilters(new PrismaErrorFilter());
	app.useGlobalFilters(new RedisErrorFilter());

	app.useGlobalFilters(new ServiceErrorFilter());
	app.useGlobalFilters(new EntitieErrorFilter());
	app.useGlobalFilters(new GatewayErrorFilter());
	app.useGlobalFilters(new GuardErrorFilter());
	app.useGlobalFilters(new AdapterErrorFilter());

	app.useGlobalFilters(new ClassValidatorErrorFilter());

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

	await app.listen(process.env.PORT || 3000);
}
bootstrap();
