import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { UserMapper } from '@app/mapper/user';
import { Request } from 'express';
import { User } from '@app/entities/user';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { USER_PREFIX } from '../consts';
import { GetCondominiumMemberByUserIdService } from '@app/services/members/condominium/getByUserId.service';
import { GetEnterpriseMemberByUserIdService } from '@app/services/members/enterprise/getByUserId.service';

@Controller(USER_PREFIX)
export class GetUserController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly getCondominiumRelation: GetCondominiumMemberByUserIdService,
		private readonly getEnterpriseCondominiumRelation: GetEnterpriseMemberByUserIdService,
	) {}

	@UseGuards(JwtGuard)
	@Get('me/condominium-member-section')
	@HttpCode(200)
	async getCondominiumMemberSection(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		const relations = await this.getCondominiumRelation.exec({
			id: user.id.value,
		});

		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { password: _, ...userAsObject } = UserMapper.toObject(user);
		return {
			...userAsObject,
			condominiums: relations.content,
		};
	}

	@UseGuards(JwtGuard)
	@Get('me/enterprise-user-section')
	@HttpCode(200)
	async getEnterpriseMemberSection(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		const relations = await this.getEnterpriseCondominiumRelation.exec({
			id: user.id.value,
		});

		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { password: _, ...userAsObject } = UserMapper.toObject(user);
		return {
			...userAsObject,
			works_on: relations.content,
		};
	}
}
