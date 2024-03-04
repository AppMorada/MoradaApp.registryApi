import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { UpdateCondominiumMemberDTO } from '@infra/http/DTO/members/condominium/update.DTO';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { UpdateEnterpriseMemberService } from '@app/services/members/enterprise/updateMember.service';

@Controller(CONDOMINIUM_PREFIX)
export class UpdateEnterpriseMemberController {
	constructor(
		private readonly updateEnterpriseMember: UpdateEnterpriseMemberService,
	) {}

	@UseGuards(AdminJwt)
	@Patch(':condominiumId/enterprise-user/:memberId')
	async getOne(
		@Param('memberId') id: string,
		@Body() body: UpdateCondominiumMemberDTO,
	) {
		return await this.updateEnterpriseMember.exec({ id, ...body });
	}
}
