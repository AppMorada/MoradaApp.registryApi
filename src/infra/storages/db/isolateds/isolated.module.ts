import { KeyRepo } from '@app/repositories/key';
import { Global, Module } from '@nestjs/common';
import { IsolatedKeyRepo } from './repositories/keys';

@Global()
@Module({
	providers: [
		{
			provide: KeyRepo,
			useClass: IsolatedKeyRepo,
		},
	],
	exports: [KeyRepo],
})
export class IsolatedRepoModule {}
