import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { CreateCondominiumService } from '@registry:app/services/createCondominium.service';
import { CreateCondominiumDTO } from '../DTO/createCondominium.DTO';
import { CondominiumMapper } from '@registry:app/mapper/condominium';
import { Email, Level } from '@registry:app/entities/VO';
import { GenInviteService } from '@registry:app/services/genInvite.service';
import { SuperAdminJwt } from '@registry:app/auth/guards/super-admin-jwt.guard';
import { InviteUserDTO } from '../DTO/inviteUser.DTO';
import { Request } from 'express';
import { DeleteUserDTO } from '../DTO/deleteAdminUser.DTO';
import { CondominiumRelUser } from '@registry:app/entities/condominiumRelUser';
import { DeleteUserService } from '@registry:app/services/deleteUser.service';
import { AdminJwt } from '@registry:app/auth/guards/admin-jwt.guard';
import { User } from '@registry:app/entities/user';

@Controller('/condominium')
export class CondominiumController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly createCondominium: CreateCondominiumService,
		private readonly genInvite: GenInviteService,
		private readonly deleteUserService: DeleteUserService,
		private readonly genInviteService: GenInviteService,
	) {}

	@Post()
	async create(@Body() body: CreateCondominiumDTO) {
		const { email: rawEmail, ...condominiumData } = body;

		const condominium = CondominiumMapper.toClass({ ...condominiumData });
		await this.createCondominium.exec({ condominium });

		const email = new Email(rawEmail);
		await this.genInvite.exec({
			email,
			requiredLevel: new Level(2), // AVISO: SUPER ADMIN SENDO CONVIDADO
			key: process.env.INVITE_SUPER_ADMIN_TOKEN_KEY,
			condominiumId: condominium.id,
		});
	}

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

	@Delete('dev/:condominiumId/delete-user')
	@UseGuards(SuperAdminJwt)
	@HttpCode(204)
	async deleteUser(@Req() req: Request, @Body() body: DeleteUserDTO) {
		const user = req.inMemoryData.user as User;

		const email = new Email(body.email);
		await this.deleteUserService.exec({
			target: email,
			actualUser: user.email,
		});
	}

	@Post(':condominiumId/invite-user')
	@UseGuards(AdminJwt)
	@HttpCode(204)
	async invite(@Req() req: Request, @Body() body: InviteUserDTO) {
		const condominiumRelUser = req.inMemoryData
			.condominiumRelUser as CondominiumRelUser;

		await this.genInviteService.exec({
			email: new Email(body.email),
			condominiumId: condominiumRelUser.condominiumId,
		});
	}
}
