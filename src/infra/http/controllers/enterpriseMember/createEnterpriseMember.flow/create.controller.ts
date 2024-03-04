import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { CreateEnterpriseUserService } from '@app/services/members/enterprise/create.service';
import { CreateEnterpriseMemberDTO } from '@infra/http/DTO/members/enterprise/create.DTO';
import { User } from '@app/entities/user';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';

@Controller(CONDOMINIUM_PREFIX)
export class CreateEnterpriseMemberController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly createEnterpriseMember: CreateEnterpriseUserService,
	) {}

	@UseGuards(AdminJwt)
	@Post(':condominiumId/enterprise-user')
	async create(
		@Body() body: CreateEnterpriseMemberDTO,
		@Param('condominiumId') id: string,
	) {
		await this.createEnterpriseMember.exec({
			user: new User({
				name: body.name,
				password: body.password,
				email: body.email,
				CPF: body.CPF,
				tfa: false,
				phoneNumber: body.phoneNumber,
			}),
			hierarchy: 1,
			condominiumId: id,
		});
	}
}
