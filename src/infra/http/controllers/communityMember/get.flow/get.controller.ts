import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../../condominium/consts';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { CondominiumMemberGuard } from '@app/auth/guards/condominium-member.guard';
import { GetCommunityMemberGroupByCondominiumIdService } from '@app/services/members/community/getByGroupByCondominiumId.service';
import { GetCommunityMemberByIdService } from '@app/services/members/community/getById.service';

@Controller(CONDOMINIUM_PREFIX)
export class GetCommunityMemberController {
	constructor(
		private readonly getMemberById: GetCommunityMemberByIdService,
		private readonly getAllMembers: GetCommunityMemberGroupByCondominiumIdService,
	) {}

	@UseGuards(AdminJwt)
	@Get(':condominiumId/as-employee/community-member/all')
	async getAllAsEmployee(@Param('condominiumId') id: string) {
		const members = await this.getAllMembers.exec({ id });
		return {
			condominiumMembers: members,
		};
	}

	@UseGuards(AdminJwt)
	@Get(':condominiumId/as-employee/community-member/:memberId')
	async getOneWithSensitiveView(@Param('memberId') id: string) {
		return await this.getMemberById.exec({ id });
	}

	@UseGuards(CondominiumMemberGuard)
	@Get(':condominiumId/as-community/community-member/all')
	async getAll(@Param('condominiumId') id: string) {
		const members = await this.getAllMembers.exec({ id });
		return {
			condominiumMembers: members,
		};
	}

	@UseGuards(CondominiumMemberGuard)
	@Get(':condominiumId/as-community/community-member/:memberId')
	async getOne(@Param('memberId') id: string) {
		return await this.getMemberById.exec({ id, pruneSensitiveData: true });
	}
}
