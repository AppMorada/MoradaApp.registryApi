import { Global, Module } from '@nestjs/common';
import { InviteRepo } from '@app/repositories/invite';
import { CondominiumRepo } from '@app/repositories/condominium';
import { UserRepo } from '@app/repositories/user';
import { databaseProviders } from './databaseProvider';
import { entitiesProviders } from './entities.provider';
import { TypeOrmCondominiumRepo } from './repositories/condominium.service';
import { TypeOrmInviteRepo } from './repositories/invite.service';
import { TypeOrmUserRepo } from './repositories/user.service';

@Global()
@Module({
	providers: [
		...databaseProviders,
		...entitiesProviders,
		{
			provide: InviteRepo,
			useClass: TypeOrmInviteRepo,
		},
		{
			provide: CondominiumRepo,
			useClass: TypeOrmCondominiumRepo,
		},
		{
			provide: UserRepo,
			useClass: TypeOrmUserRepo,
		},
	],
	exports: [
		UserRepo,
		InviteRepo,
		CondominiumRepo,
		...databaseProviders,
		...entitiesProviders,
	],
})
export class CustomTypeOrmModule {}
