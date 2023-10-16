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
import { SuperAdminJwt } from '@app/auth/guards/admin-jwt.guard';
import { DeleteUserDTO } from '../DTO/deleteAdminUser.DTO';
import { Email } from '@app/entities/VO/email';
import { DeleteUserService } from '@app/services/deleteUser.service';
import { LoginDTO } from '../DTO/login.DTO';
import { Password } from '@app/entities/VO/password';

@Controller('/user')
export class UserController {
	constructor(
		private readonly createUser: CreateUserService,
		private readonly authService: AuthService,
		private readonly deleteUserService: DeleteUserService,
	) {}

	@UseGuards(CondominiumJwt)
	@Post('super-admin')
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
	@Delete('super-admin')
	@HttpCode(204)
	async deleteUser(@Body() body: DeleteUserDTO) {
		const email = new Email(body.email);

		await this.deleteUserService.exec({ parameter: email });
	}

	@UseGuards(SuperAdminJwt)
	@Post('super-admin/create-simple-admin')
	@HttpCode(204)
	async createAdmin(@Req() req: Request, @Body() body: CreateUserDTO) {
		const superAdminData = req.inMemoryData as User;
		const user = UserMapper.toClass({
			...body,
			level: 1,
			condominiumId: superAdminData.condominiumId,
		});

		await this.createUser.exec({ user });
	}

	@Post('login')
	@HttpCode(200)
	async login(@Body() body: LoginDTO) {
		const { token } = await this.authService.exec({
			email: new Email(body.email),
			password: new Password(body.password),
		});

		return { token };
	}
}
