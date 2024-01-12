import { UserRepo } from '@registry:app/repositories/user';
import { Global, Module } from '@nestjs/common';
import { UsersFirestore } from './repositories/users';
import { CondominiumRepo } from '@registry:app/repositories/condominium';
import { CondominiumsFirestore } from './repositories/condominiums';
import { InviteRepo } from '@registry:app/repositories/invite';
import { InviteFirestore } from './repositories/invite';
import { FirestoreService } from './firestore.service';
import { CollectionsRefService } from './collectionsRefs.service';

@Global()
@Module({
	providers: [
		FirestoreService,
		CollectionsRefService,
		{
			provide: UserRepo,
			useClass: UsersFirestore,
		},
		{
			provide: CondominiumRepo,
			useClass: CondominiumsFirestore,
		},
		{
			provide: InviteRepo,
			useClass: InviteFirestore,
		},
	],
	exports: [UserRepo, CondominiumRepo, InviteRepo],
})
export class FirestoreModule {}
