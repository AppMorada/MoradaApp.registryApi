import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './databaseProvider';
import { entitiesProviders } from './entities.provider';
import { TypeOrmUserModule } from './repositories/user/TypeOrmUser.module';
import { TypeOrmCondominiumModule } from './repositories/condominium/typeOrmCondominium.module';
import { TypeOrmCommunityMemberModule } from './repositories/communityMember/typeOrmCommunityMember.module';
import { TypeOrmEmployeeMemberModule } from './repositories/employeeMember/typeOrmEmployeeMember.module';
import { TypeOrmCondominiumRequestModule } from './repositories/condominiumRequest/typeOrmCondominiumRequest.module';

@Global()
@Module({
	imports: [
		TypeOrmUserModule,
		TypeOrmCondominiumModule,
		TypeOrmCommunityMemberModule,
		TypeOrmEmployeeMemberModule,
		TypeOrmCondominiumRequestModule,
	],
	providers: [...databaseProviders, ...entitiesProviders],
	exports: [
		TypeOrmUserModule,
		TypeOrmCondominiumModule,
		TypeOrmCommunityMemberModule,
		TypeOrmEmployeeMemberModule,
		TypeOrmCondominiumRequestModule,
		...databaseProviders,
		...entitiesProviders,
	],
})
export class CustomTypeOrmModule {}
