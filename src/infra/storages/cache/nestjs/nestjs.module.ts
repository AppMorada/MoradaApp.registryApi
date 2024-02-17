import { SecretRepo } from '@app/repositories/secret';
import { Global, Module } from '@nestjs/common';
import { NestjsCacheSecret } from './repositories/secrets';
import { KeyCache } from '@app/repositories/key';
import { NestjsCacheKey } from './repositories/key';

@Global()
@Module({
	providers: [
		{
			provide: SecretRepo,
			useClass: NestjsCacheSecret,
		},
		{
			provide: KeyCache,
			useClass: NestjsCacheKey,
		},
	],
	exports: [SecretRepo, KeyCache],
})
export class NestjsCacheModule {}
