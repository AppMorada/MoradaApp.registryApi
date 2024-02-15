import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Email, Level } from '@app/entities/VO';
import { GenInviteService } from '@app/services/genInvite.service';
import { SuperAdminJwt } from '@app/auth/guards/super-admin-jwt.guard';
import { InviteUserDTO } from '@infra/http/DTO/inviteUser.DTO';
import { Request } from 'express';
import { CondominiumRelUser } from '@app/entities/condominiumRelUser';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { CONDOMINIUM_PREFIX } from '../consts';
import { GetKeyService } from '@app/services/getKey.service';
import { KeysEnum } from '@app/repositories/key';

@Controller(CONDOMINIUM_PREFIX)
export class InviteCondominiumController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly genInvite: GenInviteService,
		private readonly getKey: GetKeyService,
	) {}

	@Post(':condominiumId/invite-admin')
	@UseGuards(SuperAdminJwt)
	@HttpCode(204)
	async createAdmin(@Req() req: Request, @Body() body: InviteUserDTO) {
		const condominiumRelUser = req.inMemoryData
			.condominiumRelUser as CondominiumRelUser;
		const email = new Email(body.email);

		const { key } = await this.getKey.exec({
			name: KeysEnum.INVITE_ADMIN_TOKEN_KEY,
		});
		await this.genInvite.exec({
			requiredLevel: new Level(1),
			condominiumId: condominiumRelUser.condominiumId,
			key: key.actual.content,
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
