import { Body, Controller, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { User } from '@app/entities/user';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { Request, Response } from 'express';
import { USER_PREFIX } from '../consts';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { UpdateUserService } from '@app/services/user/update.service';
import { UpdateUserDTO } from '@infra/http/DTO/user/update.DTO';

@Controller(USER_PREFIX)
export class UpdateUserController {
	constructor(
		private readonly updateUserService: UpdateUserService,
		private readonly createToken: CreateTokenService,
		private readonly getEnv: GetEnvService,
	) {}

	private async processTokens(res: Response, user: User) {
		const { accessToken, refreshToken, refreshTokenExp } =
			await this.createToken.exec({
				user,
			});

		const expires = new Date(Date.now() + refreshTokenExp);

		const { env: NODE_ENV } = await this.getEnv.exec({
			env: EnvEnum.NODE_ENV,
		});
		res.cookie('refresh-token', refreshToken, {
			expires,
			maxAge: refreshTokenExp * 1000,
			path: '/',
			httpOnly: true,
			secure: NODE_ENV === 'production' && true,
			sameSite: 'strict',
			signed: true,
		});

		return { accessToken };
	}

	@Throttle({
		default: {
			limit: 3,
			ttl: 60000,
		},
	})
	@UseGuards(JwtGuard)
	@Patch()
	async updateUser(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() body: UpdateUserDTO,
	) {
		const user = req.inMemoryData.user as User;
		await this.updateUserService.exec({ id: user.id.value, ...body });
		await this.createToken.exec({ user });
		return await this.processTokens(res, user);
	}
}
