import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../../condominium/consts';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { RemoveCondominiumMemberService } from '@app/services/members/condominium/removeMember.service';

@Controller(CONDOMINIUM_PREFIX)
export class RemoveCondominiumMemberController {
	constructor(
		private readonly removeCondominiumMember: RemoveCondominiumMemberService,
	) {}

	@UseGuards(AdminJwt)
	@Delete(':condominiumId/as-employee/condominium-member/:memberId')
	@HttpCode(204)
	async getOne(@Param('memberId') id: string) {
		return await this.removeCondominiumMember.exec({ id });
	}
}
