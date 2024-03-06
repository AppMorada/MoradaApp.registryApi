import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { UpdateEnterpriseMemberService } from '@app/services/members/enterprise/updateMember.service';
import { UpdateEntepriseMemberDTO } from '@infra/http/DTO/members/enterprise/update.DTO';

@Controller(CONDOMINIUM_PREFIX)
export class UpdateEnterpriseMemberController {
	constructor(
		private readonly updateEnterpriseMember: UpdateEnterpriseMemberService,
	) {}

	@UseGuards(AdminJwt)
	@Patch(':condominiumId/as-employee/enterprise-user/:userId')
	async getOne(
		@Param('userId') id: string,
		@Body() body: UpdateEntepriseMemberDTO,
	) {
		return await this.updateEnterpriseMember.exec({ id, ...body });
	}
}
