import { Module } from '@nestjs/common';
import { AdaptersModule } from '@app/adapters/adapter.module';
import { JwtService } from '@nestjs/jwt';
import { GatewayModule } from '../gateways/gateway.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@infra/storages/cache/redis/redis.module';
import { PrismaModule } from '@infra/storages/db/prisma/prisma.module';
import { CondominiumModule } from './controllers/condominium/index.module';
import { UserModule } from './controllers/user/index.module';
import { HealthModule } from './controllers/health/index.module';

@Module({
	imports: [
		RedisModule,
		PrismaModule,
		AdaptersModule,
		GatewayModule,
		ThrottlerModule.forRoot([
			{
				limit: 45,
				ttl: 30000,
			},
		]),
		HealthModule,
		CondominiumModule,
		UserModule,
	],
	providers: [
		JwtService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class HttpModule {}
