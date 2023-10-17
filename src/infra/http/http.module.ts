import { Module } from '@nestjs/common';
import { CondominiumController } from './controllers/condominium.controller';
import { AdaptersModule } from '@app/adapters/adapter.module';
import { CreateCondominiumService } from '@app/services/createCondominium.service';
import { PrismaModule } from '@infra/storages/db/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './controllers/user.controller';
import { CreateUserService } from '@app/services/createUser.service';
import { AuthService } from '@app/services/auth.service';
import { DeleteUserService } from '@app/services/deleteUser.service';
import { RedisModule } from '@infra/storages/cache/redis/redis.module';
import { GenInviteService } from '@app/services/genInvite.service';

@Module({
	imports: [RedisModule, PrismaModule, AdaptersModule],
	controllers: [CondominiumController, UserController],
	providers: [
		JwtService,
		CreateCondominiumService,
		CreateUserService,
		AuthService,
		DeleteUserService,
		GenInviteService,
	],
})
export class HttpModule {}
