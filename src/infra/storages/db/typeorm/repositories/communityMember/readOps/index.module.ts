import { CommunityMemberReadOps } from '@app/repositories/communityMember/read';
import { Global, Module } from '@nestjs/common';
import { TypeOrmCommunityMemberGetByCondominiumId } from './getByCondominiumId.service';
import { TypeOrmCommunityMemberGetById } from './getById.service';
import { TypeOrmCommunityMemberGetByUserIdAndCondominiumId } from './getByUserAndCondominiumId.service';
import { TypeOrmCommunityMemberGetByUserId } from './getByUserId.service';

@Global()
@Module({
	providers: [
		{
			provide: CommunityMemberReadOps.GetByCondominiumId,
			useClass: TypeOrmCommunityMemberGetByCondominiumId,
		},
		{
			provide: CommunityMemberReadOps.GetById,
			useClass: TypeOrmCommunityMemberGetById,
		},
		{
			provide: CommunityMemberReadOps.GetByUserIdAndCondominiumId,
			useClass: TypeOrmCommunityMemberGetByUserIdAndCondominiumId,
		},
		{
			provide: CommunityMemberReadOps.GetByUserId,
			useClass: TypeOrmCommunityMemberGetByUserId,
		},
	],
	exports: [
		CommunityMemberReadOps.GetByCondominiumId,
		CommunityMemberReadOps.GetById,
		CommunityMemberReadOps.GetByUserIdAndCondominiumId,
		CommunityMemberReadOps.GetByUserId,
	],
})
export class TypeOrmCommunityMemberReadOpsModule {}
