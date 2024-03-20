import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { User } from '@app/entities/user';
import { CreateEmployeeUserService } from '@app/services/members/employee/create.service';
import { CreateEmployeeMemberDTO } from '@infra/http/DTO/members/employee/create.DTO';
import { SuperAdminJwt } from '@app/auth/guards/super-admin-jwt.guard';

@Controller(CONDOMINIUM_PREFIX)
export class CreateEnterpriseMemberController {
	constructor(
		private readonly createEnterpriseMember: CreateEmployeeUserService,
	) {}

	@UseGuards(SuperAdminJwt)
	@Post(':condominiumId/as-owner/enterprise-user')
	async create(
		@Body() body: CreateEmployeeMemberDTO,
		@Param('condominiumId') id: string,
	) {
		await this.createEnterpriseMember.exec({
			user: new User({
				name: body.name,
				password: body.password,
				tfa: false,
				phoneNumber: body.phoneNumber,
			}),
			flatAndRawUniqueRegistry: {
				CPF: body.CPF,
				email: body.email,
			},
			condominiumId: id,
		});
	}
}
