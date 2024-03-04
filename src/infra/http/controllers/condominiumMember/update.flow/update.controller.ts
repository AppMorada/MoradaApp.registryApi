import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../../condominium/consts';
import { UpdateCondominiumMemberDTO } from '@infra/http/DTO/members/condominium/update.DTO';
import { UpdateCondominiumMemberService } from '@app/services/members/condominium/updateMember.service';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';

@Controller(CONDOMINIUM_PREFIX)
export class UpdateCondominiumMemberController {
	constructor(
		private readonly updateCondominiumMember: UpdateCondominiumMemberService,
	) {}

	@UseGuards(AdminJwt)
	@Patch(':condominiumId/condominium-member/:memberId')
	async getOne(
		@Param('memberId') id: string,
		@Body() body: UpdateCondominiumMemberDTO,
	) {
		return await this.updateCondominiumMember.exec({ id, ...body });
	}
}
