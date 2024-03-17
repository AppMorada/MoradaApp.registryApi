import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../../condominium/consts';
import { UpdateCommunityMemberDTO } from '@infra/http/DTO/members/community/update.DTO';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { UpdateCommunityMemberService } from '@app/services/members/community/updateMember.service';

@Controller(CONDOMINIUM_PREFIX)
export class UpdateCommunityMemberController {
	constructor(
		private readonly updateCondominiumMember: UpdateCommunityMemberService,
	) {}

	@UseGuards(AdminJwt)
	@Patch(':condominiumId/as-employee/condominium-member/:memberId')
	async getOne(
		@Param('memberId') id: string,
		@Body() body: UpdateCommunityMemberDTO,
	) {
		return await this.updateCondominiumMember.exec({ id, ...body });
	}
}
