import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAccessTokenBody } from '../tokenTypes';
import { UserRepo } from '@registry:app/repositories/user';
import { Level } from '@registry:app/entities/VO/level';
import { GuardErrors } from '@registry:app/errors/guard';
import { Request } from 'express';

@Injectable()
export class SuperAdminJwt implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepo: UserRepo,
	) {}

	private async checkToken(token: string) {
		const tokenData: IAccessTokenBody = await this.jwtService
			.verifyAsync(token, {
				secret: process.env.ACCESS_TOKEN_KEY,
			})
			.catch(() => {
				throw new GuardErrors({ message: 'JWT inválido' });
			});

		return tokenData;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();
		const rawToken = req?.headers?.authorization;

		const token = rawToken?.split(' ')[1];
		if (!token) throw new GuardErrors({ message: 'Token não encontrado' });

		const tokenData = (await this.checkToken(token)) as IAccessTokenBody;
		const user = await this.userRepo.find({ id: tokenData.sub });
		if (!user || !user.level.equalTo(new Level(2)))
			throw new GuardErrors({
				message: 'Usuário não tem autorização para realizar tal ação',
			});

		req.inMemoryData = {
			...req.inMemoryData,
			user,
		};

		return true;
	}
}
