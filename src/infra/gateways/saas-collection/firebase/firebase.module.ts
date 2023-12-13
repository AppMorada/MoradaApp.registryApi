// import { UserRepo } from '@app/repositories/user';
// import { Global, Module } from '@nestjs/common';
// import { UsersFirestore } from './firestore/users';
// import { CondominiumRepo } from '@app/repositories/condominium';
// import { CondominiumsFirestore } from './firestore/condominiums';
//
// @Global()
// @Module({
// 	providers: [
// 		{
// 			provide: UserRepo,
// 			useClass: UsersFirestore,
// 		},
// 		{
// 			provide: CondominiumRepo,
// 			useClass: CondominiumsFirestore,
// 		},
// 	],
// 	exports: [UserRepo, CondominiumRepo],
// })
// export class FirebaseModule {}
