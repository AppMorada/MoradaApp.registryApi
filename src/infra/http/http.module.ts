import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from 'src/app/services/app.service';
import { PrismaModule } from '@infra/storages/db/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	controllers: [AppController],
	providers: [AppService],
})
export class HttpModule {}
