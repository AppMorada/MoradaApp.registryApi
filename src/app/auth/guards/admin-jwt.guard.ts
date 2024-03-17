import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import { IAccessTokenBody } from '../tokenTypes';
import { UserRepo } from '@app/repositories/user';
import { GuardErrors } from '@app/errors/guard';
import { Request } from 'express';
import { UUID } from '@app/entities/VO';
import { KeysEnum } from '@app/repositories/key';
import { ValidateTokenService } from '@app/services/login/validateToken.service';
import { CondominiumRepo } from '@app/repositories/condominium';
import { EmployeeMemberRepo } from '@app/repositories/employeeMember';

@Injectable()
export class AdminJwt implements CanActivate {
	constructor(
		private readonly validateToken: ValidateTokenService,
		private readonly userRepo: UserRepo,
		private readonly memberRepo: EmployeeMemberRepo,
		private readonly condominiumRepo: CondominiumRepo,
	) {}

	private async getEntities(sub: string, condominiumId: string) {
		const userContent = await this.userRepo
			.find({
				key: new UUID(sub),
				safeSearch: true,
			})
			.catch((err) => {
				throw new GuardErrors({
					message: err.message,
				});
			});

		const condominium = await this.condominiumRepo
			.find({
				key: new UUID(condominiumId),
				safeSearch: true,
			})
			.catch((err) => {
				throw new GuardErrors({
					message: err.message,
				});
			});

		return { userContent, condominium };
	}

	private async checkToken(token: string) {
		const { decodedToken } = await this.validateToken.exec({
			name: KeysEnum.ACCESS_TOKEN_KEY,
			token,
		});

		return decodedToken as IAccessTokenBody;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();

		const condominiumId = req?.params?.condominiumId;
		if (!condominiumId)
			throw new BadRequestException({
				statusCode: HttpStatus.BAD_REQUEST,
				error: 'Bad Request',
				message: 'Condomínio não especificado',
			});

		const token = String(req?.headers?.authorization).split(' ')[1];
		if (!token) throw new GuardErrors({ message: 'Token não encontrado' });

		const tokenData = (await this.checkToken(token)) as IAccessTokenBody;
		const { userContent, condominium } = await this.getEntities(
			tokenData.sub,
			condominiumId,
		);

		const member = await this.memberRepo.getByUserId({
			id: userContent.user.id,
		});

		const isEmployee = member?.worksOn.find(
			(item) => item.condominiumId === condominiumId,
		);
		const isOwner = condominium.ownerId.equalTo(userContent.user.id);

		if (!isEmployee && !isOwner)
			throw new GuardErrors({
				message: 'Usuário não tem autorização para realizar tal ação',
			});

		req.inMemoryData = {
			...req.inMemoryData,
			user: userContent.user,
			uniqueRegistry: userContent.uniqueRegistry,
			member,
			condominium,
		};

		return true;
	}
}
