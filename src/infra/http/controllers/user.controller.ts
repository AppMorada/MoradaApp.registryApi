import { CreateUserService } from '@app/services/createUser.service';
import {
	BadRequestException,
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
import { ApartmentNumber } from '@app/entities/VO/apartmentNumber';
import { Block } from '@app/entities/VO/block';

@Controller('user')
export class UserController {
	constructor(
		private readonly createUser: CreateUserService,
		private readonly authService: AuthService,
	) {}

	@UseGuards(HmacInviteGuard)
	@Post('accept')
	async createSimpleUser(@Req() req: Request, @Body() body: CreateUserDTO) {
		const otp = req.inMemoryData as OTP;

		if (
			(!body.apartmentNumber && otp.requiredLevel.value === 0) ||
			(!body.block && otp.requiredLevel.value === 0)
		)
			throw new BadRequestException({
				message:
					'ERROR: apartmentNumber or block field should be used on common users.',
				error: 'Bad Request',
				statusCode: 400,
			});

		const user = UserMapper.toClass({
			...body,
			apartmentNumber: body.apartmentNumber
				? new ApartmentNumber(body.apartmentNumber)
				: null,
			block: body.block ? new Block(body.block) : null,
			level: otp.requiredLevel?.value || 0,
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
