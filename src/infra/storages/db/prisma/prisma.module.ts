import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CondominiumRepo } from '@app/repositories/condominium';
import { CondominiumPrismaRepo } from './repositories/condominium.service';
import { UserRepo } from '@app/repositories/user';
import { UserPrismaRepo } from './repositories/user.service';
import { InviteRepo } from '@app/repositories/invite';
import { InvitePrismaRepo } from './repositories/invite.service';

@Global()
@Module({
	providers: [
		PrismaService,
		{
			provide: InviteRepo,
			useClass: InvitePrismaRepo,
		},
		{
			provide: CondominiumRepo,
			useClass: CondominiumPrismaRepo,
		},
		{
			provide: UserRepo,
			useClass: UserPrismaRepo,
		},
	],
	exports: [InviteRepo, CondominiumRepo, UserRepo, PrismaService],
})
export class PrismaModule {}
