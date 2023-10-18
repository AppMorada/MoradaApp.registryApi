import { CreateUserService } from '@app/services/createUser.service';
import {
	Body,
	Controller,
	Delete,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from '../DTO/createUser.DTO';
import { UserMapper } from '@app/mapper/user';
import { CondominiumJwt } from '@app/auth/guards/condominium-jwt.guard';
import { ICondominiumJwt } from '@app/auth/tokenTypes';
import { Request } from 'express';
import { AuthService } from '@app/services/auth.service';
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
		private readonly createUser: CreateUserService,
		private readonly authService: AuthService,
		private readonly deleteUserService: DeleteUserService,
		private readonly genInvite: GenInviteService,
	) {}

	@UseGuards(CondominiumJwt)
	@Post('create-itself')
	async createSuperAdmin(@Req() req: Request, @Body() body: CreateUserDTO) {
		const data = req.inMemoryData as ICondominiumJwt;
		const user = UserMapper.toClass({
			...body,
			level: 2,
			condominiumId: data.sub,
		});

		await this.createUser.exec({ user });
		const { token } = await this.authService.exec({
			email: user.email,
			password: user.password,
		});

		return { access_token: token };
	}

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
		const superAdminData = req.inMemoryData as User;
		const email = new Email(body.email);

		await this.genInvite.exec({
			requiredLevel: new Level(1),
			condominiumId: superAdminData.condominiumId,
			key: process.env.INVITE_ADMIN_TOKEN_KEY,
			email,
		});
	}
}
