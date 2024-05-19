import { CookieAdapter } from '@app/adapters/cookie';
import { GuardErrors } from '@app/errors/guard';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { IRefreshTokenBody, TokenType } from '../tokenTypes';
import { Email } from '@app/entities/VO';
import { KeysEnum } from '@app/repositories/key';
import { ValidateTokenService } from '@app/services/login/validateToken.service';
import { EnvEnum, GetEnvService } from '@infra/configs/env/getEnv.service';
import { UserReadOps } from '@app/repositories/user/read';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
	constructor(
		private readonly cookieAdapter: CookieAdapter,
		private readonly validateToken: ValidateTokenService,
		private readonly readUserRepo: UserReadOps.Read,
		private readonly getEnv: GetEnvService,
	) {}

	private async checkCookie(cookie: string) {
		const { env: COOKIE_KEY } = await this.getEnv.exec({
			env: EnvEnum.COOKIE_KEY,
		});
		const token = await this.cookieAdapter.validateSignedCookie({
			cookie: decodeURIComponent(cookie),
			key: COOKIE_KEY as string,
		});
		if (!token)
			throw new GuardErrors({
				message: 'Cookie inválido',
			});

		return token;
	}

	private async checkToken(token: string) {
		const { decodedToken } = await this.validateToken.exec({
			name: KeysEnum.REFRESH_TOKEN_KEY,
			token: token,
		});

		return decodedToken as IRefreshTokenBody;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();
		const cookie = req.headers.cookie;
		if (!cookie)
			throw new GuardErrors({
				message: `Nenhum token do tipo ${TokenType.refreshToken} foi encontrado`,
			});

		const token = cookie.split('refresh-token=')[1];
		if (!token)
			throw new GuardErrors({
				message: `Nenhum token do tipo ${TokenType.refreshToken} foi encontrado`,
			});

		const parsedToken = await this.checkCookie(token);
		const data = await this.checkToken(parsedToken);
		const userContent = await this.readUserRepo
			.exec({
				key: new Email(data.email),
				safeSearch: true,
			})
			.catch((err) => {
				throw new GuardErrors({
					message: err.message,
				});
			});

		req.inMemoryData = {
			...req.inMemoryData,
			refreshTokenContent: data,
			user: userContent.user,
			uniqueRegistry: userContent.uniqueRegistry,
		};

		return true;
	}
}
