import { CommunityMemberWriteOps } from '@app/repositories/communityMember/write';
import { Global, Module } from '@nestjs/common';
import { TypeOrmCommunityMemberCreateMany } from './createMany.service';
import { TypeOrmCommunityMemberRemove } from './remove.service';
import { TypeOrmCommunityMemberUpdate } from './update.service';

@Global()
@Module({
	providers: [
		{
			provide: CommunityMemberWriteOps.CreateMany,
			useClass: TypeOrmCommunityMemberCreateMany,
		},
		{
			provide: CommunityMemberWriteOps.Remove,
			useClass: TypeOrmCommunityMemberRemove,
		},
		{
			provide: CommunityMemberWriteOps.Update,
			useClass: TypeOrmCommunityMemberUpdate,
		},
	],
	exports: [
		CommunityMemberWriteOps.Update,
		CommunityMemberWriteOps.Remove,
		CommunityMemberWriteOps.CreateMany,
	],
})
export class TypeOrmCommunityMemberWriteOpsModule {}
