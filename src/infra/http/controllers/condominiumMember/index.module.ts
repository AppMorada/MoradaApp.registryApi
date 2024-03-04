import { Module } from '@nestjs/common';
import { UploadCollectionOfMembersController } from './uploadCollectioOfMembers.flow/uploadCollectionOfMembers.controller';
import { UpdateCondominiumMemberController } from './update.flow/update.controller';
import { RemoveCondominiumMemberController } from './delete.flow/delete.controller';
import { GetCondominiumMemberController } from './get.flow/get.controller';
import { InviteCondominiumMemberController } from './invite.flow/invite.controller';
import { UploadCollectionOfMembersService } from '@app/services/members/condominium/uploadCollectionOfUsers';
import { UpdateCondominiumMemberService } from '@app/services/members/condominium/updateMember.service';
import { RemoveCondominiumMemberService } from '@app/services/members/condominium/removeMember.service';
import { GetCondominiumMemberByIdService } from '@app/services/members/condominium/getById.service';
import { GetCondominiumMemberGroupByCondominiumIdService } from '@app/services/members/condominium/getByGroupByCondominiumId.service';
import { GenInviteService } from '@app/services/invites/genInvite.service';
import { ReloadInviteService } from '@app/services/invites/reloadInvite.service';

@Module({
	controllers: [
		UploadCollectionOfMembersController,
		UpdateCondominiumMemberController,
		RemoveCondominiumMemberController,
		GetCondominiumMemberController,
		InviteCondominiumMemberController,
	],
	providers: [
		UploadCollectionOfMembersService,
		UpdateCondominiumMemberService,
		RemoveCondominiumMemberService,
		GetCondominiumMemberByIdService,
		GetCondominiumMemberGroupByCondominiumIdService,
		GenInviteService,
		ReloadInviteService,
	],
})
export class CondominiumMemberModule {}
