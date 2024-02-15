import { Module } from '@nestjs/common';
import { AdaptersModule } from '@app/adapters/adapter.module';
import { GatewayModule } from '../gateways/gateway.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@infra/storages/cache/redis/redis.module';
import { PrismaModule } from '@infra/storages/db/prisma/prisma.module';
import { CondominiumModule } from './controllers/condominium/index.module';
import { UserModule } from './controllers/user/index.module';
import { HealthModule } from './controllers/health/index.module';
import { FirestoreModule } from '@infra/storages/db/firestore/firestore.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from '@app/auth/auth.module';

@Module({
	imports: [
		CacheModule.register({
			isGlobal: true,
		}),
		RedisModule,
		FirestoreModule,
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
		AuthModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class HttpModule {}
