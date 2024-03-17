import { Global, Module } from '@nestjs/common';
import { InviteRepo } from '@app/repositories/invite';
import { CondominiumRepo } from '@app/repositories/condominium';
import { UserRepo } from '@app/repositories/user';
import { databaseProviders } from './databaseProvider';
import { entitiesProviders } from './entities.provider';
import { TypeOrmCondominiumRepo } from './repositories/condominium.service';
import { TypeOrmInviteRepo } from './repositories/invite.service';
import { TypeOrmUserRepo } from './repositories/user.service';
import { EmployeeMemberRepo } from '@app/repositories/employeeMember';
import { TypeOrmEmployeeMemberRepo } from './repositories/employeeMember.service';
import { CommunityMemberRepo } from '@app/repositories/communityMember';
import { TypeOrmCommunityMemberRepo } from './repositories/communityMember.service';

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
			provide: EmployeeMemberRepo,
			useClass: TypeOrmEmployeeMemberRepo,
		},
		{
			provide: CommunityMemberRepo,
			useClass: TypeOrmCommunityMemberRepo,
		},
	],
	exports: [
		UserRepo,
		InviteRepo,
		CondominiumRepo,
		CommunityMemberRepo,
		EmployeeMemberRepo,
		...databaseProviders,
		...entitiesProviders,
	],
})
export class CustomTypeOrmModule {}
