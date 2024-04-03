import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../../condominium/consts';
import { UpdateCommunityMemberDTO } from '@infra/http/DTO/members/community/update.DTO';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { UpdateCommunityMemberService } from '@app/services/members/community/updateMember.service';
import { CondominiumMemberGuard } from '@app/auth/guards/condominium-member.guard';
import { Request } from 'express';

@Controller(CONDOMINIUM_PREFIX)
export class UpdateCommunityMemberController {
	constructor(
		private readonly updateCondominiumMember: UpdateCommunityMemberService,
	) {}

	@UseGuards(CondominiumMemberGuard)
	@Patch(':condominiumId/myself/as-community')
	async updateMe(
		@Req() req: Request,
		@Body() body: UpdateCommunityMemberDTO,
	) {
		const condominiumMember = req.inMemoryData.condominiumMember;
		return await this.updateCondominiumMember.exec({
			id: condominiumMember.id.value,
			...body,
		});
	}

	@UseGuards(AdminJwt)
	@Patch(':condominiumId/as-employee/community-member/:memberId')
	async update(
		@Param('memberId') id: string,
		@Body() body: UpdateCommunityMemberDTO,
	) {
		return await this.updateCondominiumMember.exec({ id, ...body });
	}
}
