import { Global, Module } from '@nestjs/common';
import { InviteRepo } from '@app/repositories/invite';
import { databaseProviders } from './databaseProvider';
import { entitiesProviders } from './entities.provider';
import { TypeOrmInviteRepo } from './repositories/invite.service';
import { CondominiumRepoReadOps } from '@app/repositories/condominium/read';
import { TypeOrmCondominiumRepoReadOps } from './repositories/condominium/condominiumReadOps.service';
import { CondominiumRepoWriteOps } from '@app/repositories/condominium/write';
import { TypeOrmCondominiumRepoWriteOps } from './repositories/condominium/condominiumWriteOps.service';
import { UserRepoReadOps } from '@app/repositories/user/read';
import { TypeOrmUserRepoReadOps } from './repositories/user/userReadOps.service';
import { UserRepoWriteOps } from '@app/repositories/user/write';
import { TypeOrmUserRepoWriteOps } from './repositories/user/userWriteOps.service';
import { EmployeeMemberRepoReadOps } from '@app/repositories/employeeMember/read';
import { TypeOrmEmployeeMemberRepoReadOps } from './repositories/employeeMember/employeeReadOps.service';
import { EmployeeMemberRepoWriteOps } from '@app/repositories/employeeMember/write';
import { TypeOrmEmployeeMemberRepoWriteOps } from './repositories/employeeMember/employeeWriteOps.service';
import { CommunityMemberRepoReadOps } from '@app/repositories/communityMember/read';
import { TypeOrmCommunityMemberRepoReadOps } from './repositories/communityMember/communityMemberReadOps.service';
import { CommunityMemberWriteOpsRepo } from '@app/repositories/communityMember/write';
import { TypeOrmCommunityMemberRepoWriteOps } from './repositories/communityMember/communityMemberWriteOps.service';

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
			provide: CondominiumRepoReadOps,
			useClass: TypeOrmCondominiumRepoReadOps,
		},
		{
			provide: CondominiumRepoWriteOps,
			useClass: TypeOrmCondominiumRepoWriteOps,
		},
		{
			provide: UserRepoReadOps,
			useClass: TypeOrmUserRepoReadOps,
		},
		{
			provide: UserRepoWriteOps,
			useClass: TypeOrmUserRepoWriteOps,
		},
		{
			provide: EmployeeMemberRepoReadOps,
			useClass: TypeOrmEmployeeMemberRepoReadOps,
		},
		{
			provide: EmployeeMemberRepoWriteOps,
			useClass: TypeOrmEmployeeMemberRepoWriteOps,
		},
		{
			provide: CommunityMemberRepoReadOps,
			useClass: TypeOrmCommunityMemberRepoReadOps,
		},
		{
			provide: CommunityMemberWriteOpsRepo,
			useClass: TypeOrmCommunityMemberRepoWriteOps,
		},
	],
	exports: [
		UserRepoReadOps,
		UserRepoWriteOps,
		InviteRepo,
		CondominiumRepoReadOps,
		CondominiumRepoWriteOps,
		CommunityMemberRepoReadOps,
		CommunityMemberWriteOpsRepo,
		EmployeeMemberRepoReadOps,
		EmployeeMemberRepoWriteOps,
		...databaseProviders,
		...entitiesProviders,
	],
})
export class CustomTypeOrmModule {}
