import { Controller, Get, HttpCode, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RefreshTokenGuard } from '@app/auth/guards/refreshToken.guard';
import { User } from '@app/entities/user';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { Request, Response } from 'express';
import { REFRESH_TOKEN_PREFIX } from '../consts';
import { EnvEnum, GetEnvService } from '@infra/configs/env/getEnv.service';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

@Controller(REFRESH_TOKEN_PREFIX)
export class RefreshTokenController {
	constructor(
		private readonly createToken: CreateTokenService,
		private readonly getEnv: GetEnvService,
	) {}

	private async processTokens(
		res: Response,
		user: User,
		uniqueRegistry: UniqueRegistry,
	) {
		const { accessToken, refreshToken, refreshTokenExp } =
			await this.createToken.exec({
				user,
				uniqueRegistry,
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
			limit: 5,
			ttl: 60000,
		},
	})
	@UseGuards(RefreshTokenGuard)
	@Get()
	@HttpCode(200)
	async refreshToken(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	) {
		const user = req.inMemoryData.user as User;
		const uniqueRegistry = req.inMemoryData
			.uniqueRegistry as UniqueRegistry;

		this.createToken.exec({ user, uniqueRegistry });
		return await this.processTokens(res, user, uniqueRegistry);
	}
}
