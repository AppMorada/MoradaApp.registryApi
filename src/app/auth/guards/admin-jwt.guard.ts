import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ICondominiumJwt, TAccessTokenJwt } from '../tokenTypes';
import { UserRepo } from '@app/repositories/user';
import { Level } from '@app/entities/VO/level';

@Injectable()
export class SuperAdminJwt implements CanActivate {
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
				throw new UnauthorizedException();
			});

		return tokenData;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const rawToken = req?.headers?.authorization;

		const token = rawToken?.split(' ')[1];
		if (!token) throw new UnauthorizedException();

		const tokenData = (await this.checkToken(token)) as TAccessTokenJwt;
		const user = await this.userRepo.find({ id: tokenData.sub });
		if (!user || !user.level.equalTo(new Level(2)))
			throw new UnauthorizedException();

		req.inMemoryData = user;

		return true;
	}
}
