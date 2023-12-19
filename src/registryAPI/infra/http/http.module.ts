import { Module } from '@nestjs/common';
import { CondominiumController } from './controllers/condominium.controller';
import { AdaptersModule } from '@registry:app/adapters/adapter.module';
import { CreateCondominiumService } from '@registry:app/services/createCondominium.service';
import { PrismaModule } from '@registry:infra/storages/db/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { CreateUserService } from '@registry:app/services/createUser.service';
import { CreateTokenService } from '@registry:app/services/createToken.service';
import { DeleteUserService } from '@registry:app/services/deleteUser.service';
import { RedisModule } from '@registry:infra/storages/cache/redis/redis.module';
import { GenInviteService } from '@registry:app/services/genInvite.service';
import { UserController } from './controllers/user.controller';
import { AdminController } from './controllers/admin.controller';
import { SuperAdminController } from './controllers/super-admin.controller';
import { GatewayModule } from '../gateways/gateway.module';
import { GenTFAService } from '@registry:app/services/genTFA.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
	],
	controllers: [
		CondominiumController,
		UserController,
		AdminController,
		SuperAdminController,
	],
	providers: [
		JwtService,
		CreateCondominiumService,
		CreateUserService,
		CreateTokenService,
		DeleteUserService,
		GenInviteService,
		GenTFAService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class HttpModule {}
