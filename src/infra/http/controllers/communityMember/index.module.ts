import { Module } from '@nestjs/common';
import { UploadCollectionOfMembersController } from './uploadCollectioOfMembers.flow/uploadCollectionOfMembers.controller';
import { UploadCollectionOfMembersService } from '@app/services/members/community/uploadCollectionOfUsers';
import { SendInviteService } from '@app/services/invites/sendInvite.service';
import { UpdateCommunityMemberService } from '@app/services/members/community/updateMember.service';
import { RemoveCommunityMemberService } from '@app/services/members/community/removeMember.service';
import { GetCommunityMemberByIdService } from '@app/services/members/community/getById.service';
import { GetCommunityMemberGroupByCondominiumIdService } from '@app/services/members/community/getByGroupByCondominiumId.service';
import { UpdateCommunityMemberController } from './update.flow/update.controller';
import { RemoveCommunityMemberController } from './delete.flow/delete.controller';
import { GetCommunityMemberController } from './get.flow/get.controller';

@Module({
	controllers: [
		UploadCollectionOfMembersController,
		UpdateCommunityMemberController,
		RemoveCommunityMemberController,
		GetCommunityMemberController,
	],
	providers: [
		UploadCollectionOfMembersService,
		UpdateCommunityMemberService,
		RemoveCommunityMemberService,
		GetCommunityMemberByIdService,
		GetCommunityMemberGroupByCondominiumIdService,
		SendInviteService,
	],
})
export class CommunityMemberModule {}
