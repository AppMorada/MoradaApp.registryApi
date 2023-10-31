import { CookieAdapter } from '@app/adapters/cookie';
import { GuardErrors } from '@app/errors/guard';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IRefreshTokenBody, TokenType } from '../tokenTypes';
import { UserRepo } from '@app/repositories/user';
import { Email } from '@app/entities/VO/email';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
	constructor(
		private readonly cookieAdapter: CookieAdapter,
		private readonly jwtService: JwtService,
		private readonly userRepo: UserRepo,
	) {}

	private async findUser(email: Email) {
		const user = await this.userRepo.find({ email });
		if (!user) throw new GuardErrors({ message: 'Usuário não existe' });

		return user;
	}

	private async checkCookie(cookie: string) {
		const token = await this.cookieAdapter.validateSignedCookie({
			cookie: decodeURIComponent(cookie),
			key: String(process.env.COOKIE_KEY),
		});

		if (!token)
			throw new GuardErrors({
				message: 'Cookie inválido',
			});

		return token;
	}

	private async checkToken(token: string) {
		const data: IRefreshTokenBody = await this.jwtService
			.verifyAsync(token, {
				secret: process.env.REFRESH_TOKEN_KEY,
			})
			.catch(() => {
				throw new GuardErrors({
					message: `Token armazenado no ${TokenType.refreshToken} é inválido`,
				});
			});

		return data;
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
		const user = await this.findUser(new Email(data.email));

		req.inMemoryData = {
			...req.inMemoryData,
			refreshTokenContent: data,
			user,
		};

		return true;
	}
}
