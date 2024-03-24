import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { User } from '@app/entities/user';
import { UserMapper } from '@app/mapper/user';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { CreateUserService } from '@app/services/user/create.service';
import { CreateUserDTO } from '@infra/http/DTO/user/create.DTO';
import { Request, Response } from 'express';
import { USER_PREFIX } from '../consts';
import { EnvEnum, GetEnvService } from '@infra/configs/env/getEnv.service';
import { Invite } from '@app/entities/invite';
import { InviteGuard } from '@app/auth/guards/invite.guard';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

@Controller(USER_PREFIX)
export class CreateUserController {
	constructor(
		private readonly createUser: CreateUserService,
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
	@UseGuards(InviteGuard)
	@Post()
	async createSimpleUser(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() body: CreateUserDTO,
	) {
		const invite = req.inMemoryData.invite as Invite;
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { CPF, code: _, ...rest } = body;

		const uniqueRegistry = new UniqueRegistry({
			CPF,
			email: body.email,
		});
		const user = UserMapper.toClass({ ...rest, tfa: false });
		await this.createUser.exec({
			user,
			invite,
			flatAndRawUniqueRegistry: {
				email: uniqueRegistry.email.value,
				CPF: uniqueRegistry.CPF!.value,
			},
		});

		return await this.processTokens(res, user, uniqueRegistry);
	}
}
