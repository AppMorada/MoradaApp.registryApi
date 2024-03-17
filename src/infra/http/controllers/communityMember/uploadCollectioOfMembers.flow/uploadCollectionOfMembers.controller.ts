import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SuperAdminJwt } from '@app/auth/guards/super-admin-jwt.guard';
import { CONDOMINIUM_PREFIX } from '../consts';
import { CommunityInvitesDTO } from '@infra/http/DTO/members/community/invites.DTO';
import { UploadCollectionOfMembersService } from '@app/services/members/community/uploadCollectionOfUsers';
import { Request } from 'express';
import { User } from '@app/entities/user';
import { Condominium } from '@app/entities/condominium';

@Controller(CONDOMINIUM_PREFIX)
export class UploadCollectionOfMembersController {
	constructor(
		private readonly uploadMembers: UploadCollectionOfMembersService,
	) {}

	@Post(':condominiumId/as-owner/community-member/invite')
	@UseGuards(SuperAdminJwt)
	async createAdmin(@Req() req: Request, @Body() body: CommunityInvitesDTO) {
		const user = req.inMemoryData.user as User;
		const condominium = req.inMemoryData.condominium as Condominium;

		await this.uploadMembers.exec({
			condominium,
			user,
			...body,
		});
	}
}
