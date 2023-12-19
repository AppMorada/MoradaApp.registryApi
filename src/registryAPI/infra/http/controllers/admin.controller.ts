import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { User } from '@registry:app/entities/user';
import { Email } from '@registry:app/entities/VO/email';
import { InviteUserDTO } from '../DTO/inviteUser.DTO';
import { GenInviteService } from '@registry:app/services/genInvite.service';
import { AdminJwt } from '@registry:app/auth/guards/admin-jwt.guard';

@Controller('admin')
export class AdminController {
	constructor(private readonly genInviteService: GenInviteService) {}

	@UseGuards(AdminJwt)
	@HttpCode(204)
	@Post('invite-user')
	async invite(@Req() req: Request, @Body() body: InviteUserDTO) {
		const data = req.inMemoryData.user as User;
		await this.genInviteService.exec({
			email: new Email(body.email),
			condominiumId: data.condominiumId,
		});
	}
}
