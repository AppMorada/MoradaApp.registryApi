import { Global, Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { FirestoreKey } from './repositories/key';
import { KeyRepo } from '@app/repositories/key';

@Global()
@Module({
	providers: [
		FirestoreService,
		{
			provide: KeyRepo,
			useClass: FirestoreKey,
		},
	],
	exports: [KeyRepo],
})
export class FirestoreModule {}
