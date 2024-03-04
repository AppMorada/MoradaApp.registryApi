import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../../condominium/consts';
import { RemoveEntepriseMemberService } from '@app/services/members/enterprise/removeMember.service';
import { SuperAdminJwt } from '@app/auth/guards/super-admin-jwt.guard';

@Controller(CONDOMINIUM_PREFIX)
export class RemoveEntepriseMemberController {
	constructor(
		private readonly removeEnterpriseMember: RemoveEntepriseMemberService,
	) {}

	@UseGuards(SuperAdminJwt)
	@Delete(':condominiumId/enterprise-user/:memberId')
	@HttpCode(204)
	async getOne(@Param('memberId') id: string) {
		return await this.removeEnterpriseMember.exec({ id });
	}
}
