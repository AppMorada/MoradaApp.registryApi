import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ICondominiumJwt, TAccessTokenJwt } from '../tokenTypes';
import { UserRepo } from '@app/repositories/user';
import { GuardErrors } from '@app/errors/guard';

@Injectable()
export class AdminJwt implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepo: UserRepo,
	) {}

	private async checkToken(token: string) {
		const tokenData: ICondominiumJwt = await this.jwtService
			.verifyAsync(token, {
				secret: process.env.ACCESS_TOKEN_KEY,
			})
			.catch(() => {
				throw new GuardErrors({ message: 'JWT inválido' });
			});

		return tokenData;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const rawToken = req?.headers?.authorization;

		const token = rawToken?.split(' ')[1];
		if (!token) throw new GuardErrors({ message: 'Token não encontrado' });

		const tokenData = (await this.checkToken(token)) as TAccessTokenJwt;
		const user = await this.userRepo.find({ id: tokenData.sub });
		if (!user || user.level.value < 1)
			throw new GuardErrors({
				message: 'Usuário não tem autorização para realizar tal ação',
			});

		req.inMemoryData = user;

		return true;
	}
}
