import { Module } from '@nestjs/common';
import { CondominiumController } from './controllers/condominium.controller';
import { AdaptersModule } from '@app/adapters/adapter.module';
import { CreateCondominiumService } from '@app/services/createCondominium.service';
import { PrismaModule } from '@infra/storages/db/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { CreateUserService } from '@app/services/createUser.service';
import { CreateTokenService } from '@app/services/createToken.service';
import { DeleteUserService } from '@app/services/deleteUser.service';
import { RedisModule } from '@infra/storages/cache/redis/redis.module';
import { GenInviteService } from '@app/services/genInvite.service';
import { UserController } from './controllers/user.controller';
import { AdminController } from './controllers/admin.controller';
import { SuperAdminController } from './controllers/super-admin.controller';
import { GatewayModule } from './gateways/gateway.module';
import { GenTFAService } from '@app/services/genTFA.service';
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
				limit: 6,
				ttl: 2000,
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
