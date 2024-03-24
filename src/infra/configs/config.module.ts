import { Global, Module } from '@nestjs/common';
import { GetEnvService } from './env/getEnv.service';

@Global()
@Module({
	providers: [GetEnvService],
	exports: [GetEnvService],
})
export class ConfigModule {}
