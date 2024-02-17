import { SecretRepo } from '@app/repositories/secret';
import { Global, Module } from '@nestjs/common';
import { NestjsCacheSecret } from './repositories/secrets';

@Global()
@Module({
	providers: [
		{
			provide: SecretRepo,
			useClass: NestjsCacheSecret,
		},
	],
	exports: [SecretRepo],
})
export class NestjsCacheModule {}
