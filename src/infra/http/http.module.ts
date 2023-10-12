import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from 'src/app/services/app.service';

@Module({
	controllers: [AppController],
	providers: [AppService],
})
export class HttpModule {}
