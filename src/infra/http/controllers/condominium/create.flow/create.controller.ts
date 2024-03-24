import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateCondominiumService } from '@app/services/condominium/create.service';
import { CreateCondominiumDTO } from '@infra/http/DTO/condominium/create.DTO';
import { CONDOMINIUM_PREFIX } from '../consts';
import { EnvEnum, GetEnvService } from '@infra/configs/env/getEnv.service';
import { CreateTokenService } from '@app/services/login/createToken.service';
import { User } from '@app/entities/user';
import { Response } from 'express';
import { TCondominiumInObject } from '@app/mapper/condominium';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

@Controller(CONDOMINIUM_PREFIX)
export class CreateCondominiumController {
	constructor(
		private readonly createCondominium: CreateCondominiumService,
		private readonly createToken: CreateTokenService,
		private readonly getEnv: GetEnvService,
	) {}

	private async processTokens(
		res: Response,
		user: User,
		uniqueRegistry: UniqueRegistry,
		condominium: Omit<TCondominiumInObject, 'seedKey'>,
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

		return { accessToken, condominium };
	}

	@Post()
	async create(
		@Res({ passthrough: true }) res: Response,
		@Body() body: CreateCondominiumDTO,
	) {
		const { user, condominium, uniqueRegistry } =
			await this.createCondominium.exec({
				user: {
					name: body.userName,
					email: body.email,
					password: body.password,
				},
				condominium: {
					name: body.condominiumName,
					CEP: body.CEP,
					CNPJ: body.CNPJ,
					num: body.num,
				},
			});
		return await this.processTokens(res, user, uniqueRegistry, condominium);
	}
}
