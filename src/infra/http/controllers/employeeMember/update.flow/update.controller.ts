import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { UpdateEmployeeMemberService } from '@app/services/members/employee/updateMember.service';
import { UpdateEmployeeMemberDTO } from '@infra/http/DTO/members/employee/update.DTO';

@Controller(CONDOMINIUM_PREFIX)
export class UpdateEnterpriseMemberController {
	constructor(
		private readonly updateEnterpriseMember: UpdateEmployeeMemberService,
	) {}

	@UseGuards(AdminJwt)
	@Patch(':condominiumId/as-employee/enterprise-user/:userId')
	async getOne(
		@Param('userId') userId: string,
		@Param('condominiumId') condominiumId: string,
		@Body() body: UpdateEmployeeMemberDTO,
	) {
		return await this.updateEnterpriseMember.exec({
			userId,
			condominiumId,
			...body,
		});
	}
}
