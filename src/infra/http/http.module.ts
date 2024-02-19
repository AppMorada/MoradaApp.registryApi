import { Module } from '@nestjs/common';
import { AdaptersModule } from '@app/adapters/adapter.module';
import { GatewayModule } from '../gateways/gateway.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from '@infra/storages/cache/redis/redis.module';
import { CondominiumModule } from './controllers/condominium/index.module';
import { UserModule } from './controllers/user/index.module';
import { HealthModule } from './controllers/health/index.module';
import { FirestoreModule } from '@infra/storages/db/firestore/firestore.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from '@app/auth/auth.module';
import { NestjsCacheModule } from '@infra/storages/cache/nestjs/nestjs.module';
import { CustomTypeOrmModule } from '@infra/storages/db/typeorm/typeorm.module';
import { IsolatedRepoModule } from '@infra/storages/db/isolateds/isolated.module';

@Module({
	imports: [
		CacheModule.register({
			isGlobal: true,
		}),
		RedisModule,
		NestjsCacheModule,
		process.env.SIGNATURE_TYPE === 'dynamic'
			? FirestoreModule
			: IsolatedRepoModule,
		CustomTypeOrmModule,
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
