import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../../condominium/consts';
import { GetCondominiumMemberByIdService } from '@app/services/members/condominium/getById.service';
import { GetCondominiumMemberGroupByCondominiumIdService } from '@app/services/members/condominium/getByGroupByCondominiumId.service';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { CondominiumMemberGuard } from '@app/auth/guards/condominium-member.guard';

@Controller(CONDOMINIUM_PREFIX)
export class GetCondominiumMemberController {
	constructor(
		private readonly getMemberById: GetCondominiumMemberByIdService,
		private readonly getAllMembers: GetCondominiumMemberGroupByCondominiumIdService,
	) {}

	@UseGuards(AdminJwt)
	@Get(':condominiumId/as-employee/condominium-member/all')
	async getAllAsEmployee(@Param('condominiumId') id: string) {
		const members = await this.getAllMembers.exec({ id });
		return {
			condominiumMembers: members,
		};
	}

	@UseGuards(AdminJwt)
	@Get(':condominiumId/as-employee/condominium-member/:memberId')
	async getOneWithSensitiveView(@Param('memberId') id: string) {
		return await this.getMemberById.exec({ id });
	}

	@UseGuards(CondominiumMemberGuard)
	@Get(':condominiumId/as-community/condominium-member/all')
	async getAll(@Param('condominiumId') id: string) {
		const members = await this.getAllMembers.exec({ id });
		return {
			condominiumMembers: members,
		};
	}

	@UseGuards(CondominiumMemberGuard)
	@Get(':condominiumId/as-community/condominium-member/:memberId')
	async getOne(@Param('memberId') id: string) {
		return await this.getMemberById.exec({ id, pruneSensitiveData: true });
	}
}
