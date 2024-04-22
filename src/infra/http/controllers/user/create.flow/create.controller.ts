import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { User } from '@app/entities/user';
import { UserMapper } from '@app/mapper/user';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { CreateUserService } from '@app/services/user/create.service';
import { CreateUserDTO } from '@infra/http/DTO/user/create.DTO';
import { Response } from 'express';
import { USER_PREFIX } from '../consts';
import { EnvEnum, GetEnvService } from '@infra/configs/env/getEnv.service';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { CreateCondominiumMemberUserDTO } from '@infra/http/DTO/user/createCondominiumMemberUser.DTO';
import { HumanReadableCondominiumIdGuard } from '@app/auth/guards/humanReadableCondominiumId.guard';

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
			limit: 5,
			ttl: 60000,
		},
	})
	@Post()
	async createSimpleUser(
		@Res({ passthrough: true }) res: Response,
		@Body() body: CreateUserDTO,
	) {
		const { CPF, ...rest } = body;

		const uniqueRegistry = new UniqueRegistry({
			CPF,
			email: body.email,
		});
		const user = UserMapper.toClass({
			...rest,
			tfa: false,
			uniqueRegistryId: uniqueRegistry.id.value,
		});
		await this.createUser.exec({ user, uniqueRegistry });

		return await this.processTokens(res, user, uniqueRegistry);
	}

	@Throttle({
		default: {
			limit: 5,
			ttl: 60000,
		},
	})
	@UseGuards(HumanReadableCondominiumIdGuard)
	@Post('/condominium-member-context')
	async createUserAsCondominiumMember(
		@Res({ passthrough: true }) res: Response,
		@Body() body: CreateCondominiumMemberUserDTO,
	) {
		const uniqueRegistry = new UniqueRegistry({ email: body.email });
		const user = UserMapper.toClass({
			...body,
			tfa: false,
			uniqueRegistryId: uniqueRegistry.id.value,
		});

		const result = await this.createUser.exec({ user, uniqueRegistry });
		if (!result?.affectedCondominiumMembers) res.status(202);

		return await this.processTokens(res, user, uniqueRegistry);
	}
}
