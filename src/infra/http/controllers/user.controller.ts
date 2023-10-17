import { CreateUserService } from '@app/services/createUser.service';
import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from '../DTO/createUser.DTO';
import { UserMapper } from '@app/mapper/user';
import { Request } from 'express';
import { AuthService } from '@app/services/auth.service';
import { Email } from '@app/entities/VO/email';
import { LoginDTO } from '../DTO/login.DTO';
import { Password } from '@app/entities/VO/password';
import { OTP } from '@app/entities/OTP';
import { HmacInviteGuard } from '@app/auth/guards/hmac-invite.guard';

@Controller('user')
export class UserController {
	constructor(
		private readonly createUser: CreateUserService,
		private readonly authService: AuthService,
	) {}

	@UseGuards(HmacInviteGuard)
	@Post()
	async createSimpleUser(@Req() req: Request, @Body() body: CreateUserDTO) {
		const otp = req.inMemoryData as OTP;

		const user = UserMapper.toClass({
			...body,
			level: 0,
			condominiumId: otp.condominiumId,
		});

		await this.createUser.exec({ user });
		const { token } = await this.authService.exec({
			email: user.email,
			password: user.password,
		});

		return { token };
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
