import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';

@Module({
	imports: [
		TerminusModule.forRoot({
			errorLogStyle: 'pretty',
		}),
		AxiosHttpModule,
	],
	controllers: [HealthController],
})
export class HealthModule {}
