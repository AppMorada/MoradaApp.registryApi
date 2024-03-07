import { Controller, Get, HttpCode, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CheckTFACodeGuard } from '@app/auth/guards/checkTFACode.guard';
import { User } from '@app/entities/user';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { Request, Response } from 'express';
import { LOGIN_PREFIX } from '../consts';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';

@Controller(LOGIN_PREFIX)
export class TfaController {
	constructor(
		private readonly createToken: CreateTokenService,
		private readonly getEnv: GetEnvService,
	) {}

	private async processTokens(res: Response, user: User) {
		const { accessToken, refreshToken, refreshTokenExp } =
			await this.createToken.exec({
				user,
			});

		const expires = new Date(Date.now() + refreshTokenExp * 1000);

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
	@UseGuards(CheckTFACodeGuard)
	@Get('tfa')
	@HttpCode(200)
	async login(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	) {
		const user = req.inMemoryData.user as User;
		return await this.processTokens(res, user);
	}
}
