import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CondominiumRepo } from '@app/repositories/condominium';
import { CondominiumPrismaRepo } from './repositories/condominium.service';

@Global()
@Module({
	providers: [
		PrismaService,
		{
			provide: CondominiumRepo,
			useClass: CondominiumPrismaRepo,
		},
	],
	exports: [CondominiumRepo],
})
export class PrismaModule {}
