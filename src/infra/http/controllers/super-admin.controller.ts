import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '@app/entities/user';
import { SuperAdminJwt } from '@app/auth/guards/super-admin-jwt.guard';
import { DeleteUserDTO } from '../DTO/deleteAdminUser.DTO';
import { Email } from '@app/entities/VO/email';
import { DeleteUserService } from '@app/services/deleteUser.service';
import { GenInviteService } from '@app/services/genInvite.service';
import { InviteUserDTO } from '../DTO/inviteUser.DTO';
import { Level } from '@app/entities/VO/level';

@Controller('super-admin')
export class SuperAdminController {
	constructor(
		private readonly deleteUserService: DeleteUserService,
		private readonly genInvite: GenInviteService,
	) {}

	@UseGuards(SuperAdminJwt)
	@Delete()
	@HttpCode(204)
	async deleteUser(@Body() body: DeleteUserDTO) {
		const email = new Email(body.email);

		await this.deleteUserService.exec({ parameter: email });
	}

	@UseGuards(SuperAdminJwt)
	@Post('invite-admin')
	@HttpCode(204)
	async createAdmin(@Req() req: Request, @Body() body: InviteUserDTO) {
		const superAdminData = req.inMemoryData.user as User;
		const email = new Email(body.email);

		await this.genInvite.exec({
			requiredLevel: new Level(1),
			condominiumId: superAdminData.condominiumId,
			key: process.env.INVITE_ADMIN_TOKEN_KEY,
			email,
		});
	}
}
