import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CondominiumRepo } from '@registry:app/repositories/condominium';
import { CondominiumPrismaRepo } from './repositories/condominium.service';
import { UserRepo } from '@registry:app/repositories/user';
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
