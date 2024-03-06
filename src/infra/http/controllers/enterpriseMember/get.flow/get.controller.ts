import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { GetEnterpriseMemberGroupByCondominiumIdService } from '@app/services/members/enterprise/getByGroupByCondominiumId.service';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { GetEnterpriseMemberByUserIdService } from '@app/services/members/enterprise/getByUserId.service';

@Controller(CONDOMINIUM_PREFIX)
export class GetEnterpriseMemberController {
	constructor(
		private readonly getMemberByUserId: GetEnterpriseMemberByUserIdService,
		private readonly getAllMembers: GetEnterpriseMemberGroupByCondominiumIdService,
	) {}

	@UseGuards(AdminJwt)
	@Get(':condominiumId/as-employee/enterprise-user/all')
	async getAll(@Param('condominiumId') id: string) {
		const members = await this.getAllMembers.exec({ id });
		return {
			employees: members,
		};
	}

	@UseGuards(AdminJwt)
	@Get(':condominiumId/as-employee/enterprise-user/:userId')
	async getOne(@Param('userId') id: string) {
		return await this.getMemberByUserId.exec({ id });
	}
}
