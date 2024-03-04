import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { GetEnterpriseMemberByIdService } from '@app/services/members/enterprise/getById.service';
import { GetEnterpriseMemberGroupByCondominiumIdService } from '@app/services/members/enterprise/getByGroupByCondominiumId.service';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';

@Controller(CONDOMINIUM_PREFIX)
export class GetEnterpriseMemberController {
	constructor(
		private readonly getMemberById: GetEnterpriseMemberByIdService,
		private readonly getAllMembers: GetEnterpriseMemberGroupByCondominiumIdService,
	) {}

	@UseGuards(AdminJwt)
	@Get(':condominiumId/enterprise-user/all')
	async getAll(@Param('condominiumId') id: string) {
		const members = await this.getAllMembers.exec({ id });
		return {
			employees: members,
		};
	}

	@UseGuards(AdminJwt)
	@Get(':condominiumId/enterprise-user/:memberId')
	async getOne(@Param('memberId') id: string) {
		return await this.getMemberById.exec({ id });
	}
}
