import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ICondominiumJwt } from '../tokenTypes';

@Injectable()
export class CondominiumJwt implements CanActivate {
	constructor(private readonly jwtService: JwtService) {}

	private async checkToken(token: string) {
		const tokenData: ICondominiumJwt = await this.jwtService
			.verifyAsync(token, {
				secret: process.env.CONDOMINIUM_TOKEN_KEY,
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

		const data = await this.checkToken(token);
		req.inMemoryData = data;

		return true;
	}
}
