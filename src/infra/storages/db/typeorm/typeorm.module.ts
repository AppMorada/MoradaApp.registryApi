import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './databaseProvider';
import { entitiesProviders } from './entities.provider';
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
import { CondominiumRequestRepoReadOps } from '@app/repositories/condominiumRequest/read';
import { TypeOrmCondominiumRequestReadOps } from './repositories/condominiumRequest/condominiumRequestReadOps.service';
import { CondominiumRequestRepoWriteOps } from '@app/repositories/condominiumRequest/write';
import { TypeOrmCondominiumRequestWriteOps } from './repositories/condominiumRequest/condominiumRequestWriteOps.service';

@Global()
@Module({
	providers: [
		...databaseProviders,
		...entitiesProviders,
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
		{
			provide: CondominiumRequestRepoReadOps,
			useClass: TypeOrmCondominiumRequestReadOps,
		},
		{
			provide: CondominiumRequestRepoWriteOps,
			useClass: TypeOrmCondominiumRequestWriteOps,
		},
	],
	exports: [
		UserRepoReadOps,
		UserRepoWriteOps,
		CondominiumRepoReadOps,
		CondominiumRepoWriteOps,
		CondominiumRequestRepoReadOps,
		CondominiumRequestRepoWriteOps,
		CommunityMemberRepoReadOps,
		CommunityMemberWriteOpsRepo,
		EmployeeMemberRepoReadOps,
		EmployeeMemberRepoWriteOps,
		...databaseProviders,
		...entitiesProviders,
	],
})
export class CustomTypeOrmModule {}
