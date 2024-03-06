import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CheckPasswordGuard } from '@app/auth/guards/checkPassword.guard';
import { User } from '@app/entities/user';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { Request, Response } from 'express';
import { StartLoginDTO } from '@infra/http/DTO/login/login.DTO';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';
import { LOGIN_PREFIX } from '../consts';

@Controller(LOGIN_PREFIX)
export class StartLoginController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly createToken: CreateTokenService,
		private readonly genTFA: GenTFAService,
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

		return res.status(200).json({ accessToken }).end();
	}

	@Throttle({
		default: {
			limit: 3,
			ttl: 60000,
		},
	})
	@UseGuards(CheckPasswordGuard)
	@Post()
	async launchTFA(
		@Req() req: Request,
		@Res() res: Response,
		/* eslint-disable @typescript-eslint/no-unused-vars */
		@Body() _: StartLoginDTO,
	) {
		const user = req.inMemoryData.user as User;
		if (user.tfa) {
			await this.genTFA.exec({
				email: user.email,
				userId: user.id,
			});
			return res.status(202).end();
		}

		await this.processTokens(res, user);
	}
}
