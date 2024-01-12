import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAccessTokenBody } from '../tokenTypes';
import { UserRepo } from '@registry:app/repositories/user';
import { GuardErrors } from '@registry:app/errors/guard';
import { Request } from 'express';
import { UUID } from '@registry:app/entities/VO';

/** Usado para validar se um usuário tem permissões de um funcionário */
@Injectable()
export class AdminJwt implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userRepo: UserRepo,
	) {}

	private async checkToken(token: string) {
		const tokenData = await this.jwtService
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

		const condominiumId = req.params?.condominiumId;
		if (!condominiumId)
			throw new BadRequestException({
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'Bad Request',
				message: 'Condomínio não especificado',
			});

		const token = rawToken?.split(' ')[1];
		if (!token) throw new GuardErrors({ message: 'Token não encontrado' });

		const tokenData = (await this.checkToken(token)) as IAccessTokenBody;
		const user = await this.userRepo.find({
			key: new UUID(tokenData.sub),
			safeSearch: true,
		});
		const condominiumRelUser = await this.userRepo.getCondominiumRelation({
			userId: user.id,
			condominiumId: new UUID(condominiumId),
		});

		if (!condominiumRelUser || condominiumRelUser.level.value < 1)
			throw new GuardErrors({
				message: 'Usuário não tem autorização para realizar tal ação',
			});

		req.inMemoryData = {
			...req.inMemoryData,
			user,
			condominiumRelUser,
		};

		return true;
	}
}
