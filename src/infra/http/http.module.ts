import { Module } from '@nestjs/common';
import { CondominiumController } from './controllers/condominium.controller';
import { AdaptersModule } from '@app/adapters/adapter.module';
import { CreateCondominiumService } from '@app/services/createCondominium.service';
import { PrismaModule } from '@infra/storages/db/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [PrismaModule, AdaptersModule],
	controllers: [CondominiumController],
	providers: [JwtService, CreateCondominiumService],
})
export class HttpModule {}
