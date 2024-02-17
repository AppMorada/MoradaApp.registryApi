import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CheckOTPGuard } from '@app/auth/guards/checkOTP.guard';
import { CheckPasswordGuard } from '@app/auth/guards/checkPassword.guard';
import { CheckTFACodeGuard } from '@app/auth/guards/checkTFACode.guard';
import { RefreshTokenGuard } from '@app/auth/guards/refreshToken.guard';
import { User } from '@app/entities/user';
import { CreateTokenService } from '@app/services/createToken.service';
import { GenTFAService } from '@app/services/genTFA.service';
import { GenOldTFASevice } from '@app/services/genTFACode.old.service';
import { Request, Response } from 'express';
import { USER_PREFIX } from '../consts';
import { StartLoginDTO } from '@infra/http/DTO/login.DTO';
import { FinishLoginWithOTPDTO } from '@infra/http/DTO/finishLoginWithOTP.DTO';
import { FinishLoginWithTFADTO } from '@infra/http/DTO/finishLoginWithTFA.DTO';
import { EnvEnum, GetEnvService } from '@infra/configs/getEnv.service';

@Controller(USER_PREFIX)
export class LoginUserController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly createToken: CreateTokenService,
		private readonly oldTFA: GenOldTFASevice,
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

		return { accessToken };
	}

	@Throttle({
		default: {
			limit: 3,
			ttl: 60000,
		},
	})
	@UseGuards(CheckPasswordGuard)
	@Post('/old/launch-tfa')
	@HttpCode(204)
	async launchTFAOld(
		@Req() req: Request,
		/* eslint-disable @typescript-eslint/no-unused-vars */
		@Body() _: StartLoginDTO,
	) {
		const user = req.inMemoryData.user as User;
		await this.oldTFA.exec({
			email: user.email,
			userId: user.id,
		});
	}

	@Throttle({
		default: {
			limit: 3,
			ttl: 60000,
		},
	})
	@UseGuards(CheckOTPGuard)
	@Post('/old/login')
	@HttpCode(200)
	async oldLogin(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
		/* eslint-disable @typescript-eslint/no-unused-vars */
		@Body() _: FinishLoginWithOTPDTO,
	) {
		const user = req.inMemoryData.user as User;
		return await this.processTokens(res, user);
	}

	@Throttle({
		default: {
			limit: 3,
			ttl: 60000,
		},
	})
	@UseGuards(CheckPasswordGuard)
	@Post('launch-tfa')
	@HttpCode(204)
	async launchTFA(
		@Req() req: Request,
		/* eslint-disable @typescript-eslint/no-unused-vars */
		@Body() _: StartLoginDTO,
	) {
		const user = req.inMemoryData.user as User;
		await this.genTFA.exec({
			email: user.email,
			userId: user.id,
		});
	}

	@Throttle({
		default: {
			limit: 3,
			ttl: 60000,
		},
	})
	@UseGuards(CheckTFACodeGuard)
	@Post('login')
	@HttpCode(200)
	async login(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
		/* eslint-disable @typescript-eslint/no-unused-vars */
		@Body() _: FinishLoginWithTFADTO,
	) {
		const user = req.inMemoryData.user as User;
		return await this.processTokens(res, user);
	}

	@Throttle({
		default: {
			limit: 5,
			ttl: 60000,
		},
	})
	@UseGuards(RefreshTokenGuard)
	@Get('get-tokens')
	@HttpCode(200)
	async refreshToken(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	) {
		const user = req.inMemoryData.user as User;
		this.createToken.exec({ user });
		return await this.processTokens(res, user);
	}
}
