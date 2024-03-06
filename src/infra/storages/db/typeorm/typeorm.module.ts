import { Global, Module } from '@nestjs/common';
import { InviteRepo } from '@app/repositories/invite';
import { CondominiumRepo } from '@app/repositories/condominium';
import { UserRepo } from '@app/repositories/user';
import { databaseProviders } from './databaseProvider';
import { entitiesProviders } from './entities.provider';
import { TypeOrmCondominiumRepo } from './repositories/condominium.service';
import { TypeOrmInviteRepo } from './repositories/invite.service';
import { TypeOrmUserRepo } from './repositories/user.service';
import { EnterpriseMemberRepo } from '@app/repositories/enterpriseMember';
import { TypeOrmEnterpriseMemberRepo } from './repositories/enterpriseMember.service';
import { CondominiumMemberRepo } from '@app/repositories/condominiumMember';
import { TypeOrmCondominiumMemberRepo } from './repositories/condominiumMember.service';

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
		{
			provide: EnterpriseMemberRepo,
			useClass: TypeOrmEnterpriseMemberRepo,
		},
		{
			provide: CondominiumMemberRepo,
			useClass: TypeOrmCondominiumMemberRepo,
		},
	],
	exports: [
		UserRepo,
		InviteRepo,
		CondominiumRepo,
		EnterpriseMemberRepo,
		CondominiumMemberRepo,
		...databaseProviders,
		...entitiesProviders,
	],
})
export class CustomTypeOrmModule {}
