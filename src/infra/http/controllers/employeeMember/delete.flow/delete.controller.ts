import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../../condominium/consts';
import { RemoveEmployeeMemberService } from '@app/services/members/employee/removeMember.service';
import { SuperAdminJwt } from '@app/auth/guards/super-admin-jwt.guard';

@Controller(CONDOMINIUM_PREFIX)
export class RemoveEntepriseMemberController {
	constructor(
		private readonly removeEnterpriseMember: RemoveEmployeeMemberService,
	) {}

	@UseGuards(SuperAdminJwt)
	@Delete(':condominiumId/as-owner/enterprise-user/:userId')
	@HttpCode(204)
	async getOne(
		@Param('userId') userId: string,
		@Param('condominiumId') condominiumId: string,
	) {
		return await this.removeEnterpriseMember.exec({
			condominiumId,
			userId,
		});
	}
}
