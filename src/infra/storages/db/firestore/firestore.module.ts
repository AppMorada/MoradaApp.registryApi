import { Global, Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

@Global()
@Module({
	providers: [FirestoreService],
	exports: [],
})
export class FirestoreModule {}
