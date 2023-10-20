import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CondominiumRepo } from '@app/repositories/condominium';
import { CondominiumPrismaRepo } from './repositories/condominium.service';
import { UserRepo } from '@app/repositories/user';
import { UserPrismaRepo } from './repositories/user.service';

@Global()
@Module({
	providers: [
		PrismaService,
		{
			provide: CondominiumRepo,
			useClass: CondominiumPrismaRepo,
		},
		{
			provide: UserRepo,
			useClass: UserPrismaRepo,
		},
	],
	exports: [CondominiumRepo, UserRepo],
})
export class PrismaModule {}
