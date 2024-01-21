import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Email, Level } from '@registry:app/entities/VO';
import { GenInviteService } from '@registry:app/services/genInvite.service';
import { SuperAdminJwt } from '@registry:app/auth/guards/super-admin-jwt.guard';
import { InviteUserDTO } from '@registry:infra/http/DTO/inviteUser.DTO';
import { Request } from 'express';
import { CondominiumRelUser } from '@registry:app/entities/condominiumRelUser';
import { AdminJwt } from '@registry:app/auth/guards/admin-jwt.guard';
import { CONDOMINIUM_PREFIX } from '../consts';

@Controller(CONDOMINIUM_PREFIX)
export class InviteCondominiumController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(private readonly genInvite: GenInviteService) {}

	@Post(':condominiumId/invite-admin')
	@UseGuards(SuperAdminJwt)
	@HttpCode(204)
	async createAdmin(@Req() req: Request, @Body() body: InviteUserDTO) {
		const condominiumRelUser = req.inMemoryData
			.condominiumRelUser as CondominiumRelUser;
		const email = new Email(body.email);

		await this.genInvite.exec({
			requiredLevel: new Level(1),
			condominiumId: condominiumRelUser.condominiumId,
			key: process.env.INVITE_ADMIN_TOKEN_KEY,
			email,
		});
	}

	@Post(':condominiumId/invite-user')
	@UseGuards(AdminJwt)
	@HttpCode(204)
	async invite(@Req() req: Request, @Body() body: InviteUserDTO) {
		const condominiumRelUser = req.inMemoryData
			.condominiumRelUser as CondominiumRelUser;

		await this.genInvite.exec({
			email: new Email(body.email),
			condominiumId: condominiumRelUser.condominiumId,
		});
	}
}
