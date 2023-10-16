import { CreateUserService } from '@app/services/createUser.service';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from '../DTO/createUser.DTO';
import { UserMapper } from '@app/mapper/user';
import { CondominiumJwt } from '@app/auth/guards/condominium-jwt.guard';
import { ICondominiumJwt } from '@app/auth/tokenTypes';
import { Request } from 'express';
import { AuthService } from '@app/services/auth.service';
import { User } from '@app/entities/user';
import { AdminJwt } from '@app/auth/guards/admin-jwt.guard';

@Controller('/user')
export class UserController {
	constructor(
		private readonly createUser: CreateUserService,
		private readonly authService: AuthService,
	) {}

	@UseGuards(CondominiumJwt)
	@Post('super-admin')
	async createSuper(@Req() req: Request, @Body() body: CreateUserDTO) {
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

	@UseGuards(AdminJwt)
	@Post('admin')
	async createAdmin(@Req() req: Request, @Body() body: CreateUserDTO) {
		const superAdminData = req.inMemoryData as User;
		const user = UserMapper.toClass({
			...body,
			level: 1,
			condominiumId: superAdminData.condominiumId,
		});

		await this.createUser.exec({ user });
	}
}
