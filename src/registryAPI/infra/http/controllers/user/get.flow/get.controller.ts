import { Controller, Get, HttpCode, Req, UseGuards } from '@nestjs/common';
import { UserMapper } from '@registry:app/mapper/user';
import { Request } from 'express';
import { User } from '@registry:app/entities/user';
import { JwtGuard } from '@registry:app/auth/guards/jwt.guard';
import { GetCondominiumRelUserService } from '@registry:app/services/getCondominiumRel.service';
import { USER_PREFIX } from '../consts';

@Controller(USER_PREFIX)
export class GetUserController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly getCondominiumRelUserService: GetCondominiumRelUserService,
	) {}

	@UseGuards(JwtGuard)
	@Get()
	@HttpCode(200)
	async getAccount(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		const { condominiumRels } =
			await this.getCondominiumRelUserService.exec({ userId: user.id });

		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { password: _, ...userAsObject } = UserMapper.toObject(user);
		return {
			user: {
				...userAsObject,
				condominiumRels,
			},
		};
	}
}
