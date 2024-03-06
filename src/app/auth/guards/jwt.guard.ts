import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRepo } from '@app/repositories/user';
import { IAccessTokenBody } from '../tokenTypes';
import { GuardErrors } from '@app/errors/guard';
import { Request } from 'express';
import { UUID } from '@app/entities/VO';
import { KeysEnum } from '@app/repositories/key';
import { ValidateTokenService } from '@app/services/login/validateToken.service';

/** Usado para validar um JWT vindo do authorization header */
@Injectable()
export class JwtGuard implements CanActivate {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly validateToken: ValidateTokenService,
	) {}

	private async checkToken(token: string) {
		const { decodedToken } = await this.validateToken.exec({
			name: KeysEnum.ACCESS_TOKEN_KEY,
			token: token,
		});

		return decodedToken as IAccessTokenBody;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const token = String(req?.headers?.authorization).split(' ')[1];
		if (!token) throw new GuardErrors({ message: 'Token não encontrado' });

		const tokenData = (await this.checkToken(token)) as IAccessTokenBody;

		const user = await this.userRepo
			.find({
				key: new UUID(tokenData.sub),
				safeSearch: true,
			})
			.catch((err) => {
				throw new GuardErrors({
					message: err.message,
				});
			});

		req.inMemoryData = {
			...req.inMemoryData,
			user,
		};

		return true;
	}
}
