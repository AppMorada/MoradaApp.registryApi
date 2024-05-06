import { Global, Module } from '@nestjs/common';
import { TypeOrmCommunityMemberReadOpsModule } from './readOps/index.module';
import { TypeOrmCommunityMemberWriteOpsModule } from './writeOps/index.module';

@Global()
@Module({
	imports: [
		TypeOrmCommunityMemberReadOpsModule,
		TypeOrmCommunityMemberWriteOpsModule,
	],
	exports: [
		TypeOrmCommunityMemberReadOpsModule,
		TypeOrmCommunityMemberWriteOpsModule,
	],
})
export class TypeOrmCommunityMemberModule {}
