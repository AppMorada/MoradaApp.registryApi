import { Global, Module } from '@nestjs/common';
import { GetEnvService } from './env/getEnv.service';
import { TRACE_ID, trace } from './tracing';

@Global()
@Module({
	providers: [
		GetEnvService,
		{
			provide: TRACE_ID,
			useValue: trace,
		},
	],
	exports: [GetEnvService, TRACE_ID],
})
export class ConfigModule {}
