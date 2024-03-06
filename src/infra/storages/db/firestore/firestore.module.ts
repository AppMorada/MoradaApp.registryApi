import { Global, Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { FirestoreKey } from './repositories/key';
import { KeyRepo } from '@app/repositories/key';
import { FirestoreListeners } from './repositories/listeners';

@Global()
@Module({
	providers: [
		FirestoreListeners,
		FirestoreService,
		{
			provide: KeyRepo,
			useClass: FirestoreKey,
		},
	],
	exports: [KeyRepo],
})
export class FirestoreModule {}
