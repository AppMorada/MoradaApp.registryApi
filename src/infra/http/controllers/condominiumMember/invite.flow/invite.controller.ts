import {
	Body,
	Controller,
	HttpCode,
	Param,
	Post,
	Req,
	UnprocessableEntityException,
	UseGuards,
} from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { GenInviteService } from '@app/services/invites/genInvite.service';
import { InviteUserDTO } from '@infra/http/DTO/members/condominium/invite.DTO';
import { Throttle } from '@nestjs/throttler';
import { ReloadInviteService } from '@app/services/invites/reloadInvite.service';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { ReloadInviteUserDTO } from '@infra/http/DTO/members/condominium/Reloadinvite.DTO';
import { Request } from 'express';
import { User } from '@app/entities/user';

@Controller(CONDOMINIUM_PREFIX)
export class InviteCondominiumMemberController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly invite: GenInviteService,
		private readonly reloadInvite: ReloadInviteService,
	) {}

	@Post(':condominiumId/invite')
	@UseGuards(AdminJwt)
	async createAdmin(
		@Req() req: Request,
		@Body() body: InviteUserDTO,
		@Param('condominiumId') id: string,
	) {
		const user = req.inMemoryData.user as User;
		if (user.CPF.value === body.CPF)
			throw new UnprocessableEntityException({
				statusCode: 422,
				message: 'Não foi possível processar os dados',
			});

		await this.invite.exec({
			condominiumId: id,
			recipient: body.email,
			CPF: body.CPF,
			hierarchy: 0,
		});
	}

	@Throttle({
		default: {
			limit: 1,
			ttl: 30000,
		},
	})
	@Post('invite/reload')
	@HttpCode(204)
	async resendInvite(@Body() body: ReloadInviteUserDTO) {
		await this.reloadInvite.exec({ recipient: body.email });
	}
}
