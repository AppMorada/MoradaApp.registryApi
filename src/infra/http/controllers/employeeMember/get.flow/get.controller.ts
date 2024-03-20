import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { GetEmployeeMemberByUserIdService } from '@app/services/members/employee/getByUserId.service';
import { GetEmployeeMemberGroupByCondominiumIdService } from '@app/services/members/employee/getByGroupByCondominiumId.service';

@Controller(CONDOMINIUM_PREFIX)
export class GetEnterpriseMemberController {
	constructor(
		private readonly getMemberByUserId: GetEmployeeMemberByUserIdService,
		private readonly getAllMembers: GetEmployeeMemberGroupByCondominiumIdService,
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
		const member = await this.getMemberByUserId.exec({ id });
		return {
			userData: member.content?.user ?? null,
			uniqueRegistry: member.content?.uniqueRegistry ?? null,
			worksOn: member.content?.worksOn ?? null,
		};
	}
}
