import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { SuperAdminJwt } from '@app/auth/guards/super-admin-jwt.guard';
import { CONDOMINIUM_PREFIX } from '../consts';
import { CondominiumInvitesDTO } from '@infra/http/DTO/members/condominium/invites.DTO';
import { UploadCollectionOfMembersService } from '@app/services/members/condominium/uploadCollectionOfUsers';

@Controller(CONDOMINIUM_PREFIX)
export class UploadCollectionOfMembersController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly uploadMembers: UploadCollectionOfMembersService,
	) {}

	@Post(':condominiumId/as-owner/condominium-member/invite')
	@UseGuards(SuperAdminJwt)
	async createAdmin(
		@Body() body: CondominiumInvitesDTO,
		@Param('condominiumId') id: string,
	) {
		await this.uploadMembers.exec({
			condominiumId: id,
			...body,
		});
	}
}
