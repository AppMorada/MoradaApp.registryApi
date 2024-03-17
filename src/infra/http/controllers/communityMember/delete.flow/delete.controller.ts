import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../../condominium/consts';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { RemoveCommunityMemberService } from '@app/services/members/community/removeMember.service';

@Controller(CONDOMINIUM_PREFIX)
export class RemoveCommunityMemberController {
	constructor(
		private readonly removeCondominiumMember: RemoveCommunityMemberService,
	) {}

	@UseGuards(AdminJwt)
	@Delete(':condominiumId/as-employee/condominium-member/:memberId')
	@HttpCode(204)
	async getOne(@Param('memberId') id: string) {
		return await this.removeCondominiumMember.exec({ id });
	}
}
