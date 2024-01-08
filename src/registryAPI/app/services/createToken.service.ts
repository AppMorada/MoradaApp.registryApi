import {
	IAccessTokenBody,
	IRefreshTokenBody,
	TokenType,
} from '@registry:app/auth/tokenTypes';
import {
	ApartmentNumber,
	Block,
	Email,
	Level,
	Name,
	PhoneNumber,
	UUID,
} from '@registry:app/entities/VO';
import { User } from '@registry:app/entities/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IService } from './_IService';

interface IUserDataCore {
	id: UUID;
	email: Email;
	block?: Block;
	apartmentNumber?: ApartmentNumber;
	name: Name;
	level: Level;
	createdAt: Date;
	updatedAt: Date;
	phoneNumber: PhoneNumber;
}

interface IProps {
	user: User | IUserDataCore;
}

/** Serviço responsável por gerar o token de acesso e o de renovação */
@Injectable()
export class CreateTokenService implements IService {
	constructor(private readonly jwtService: JwtService) {}

	private async buildAccessToken(user: User | IUserDataCore) {
		const exp = parseInt(process.env.ACCESS_TOKEN_EXP as string);
		const accessJwtBody: Omit<IAccessTokenBody, 'iat' | 'exp'> = {
			sub: user.id.value,
			content: {
				email: user.email.value,
				name: user.name.value,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				phoneNumber: user.phoneNumber.value,
			},
			type: TokenType.accessToken,
		};

		return await this.jwtService.signAsync(accessJwtBody, {
			secret: process.env.ACCESS_TOKEN_KEY,
			expiresIn: exp,
		});
	}

	private async buildRefreshToken(email: Email, userId: UUID) {
		const exp = parseInt(process.env.REFRESH_TOKEN_EXP as string);
		const refreshJwtBody: Omit<IRefreshTokenBody, 'iat' | 'exp'> = {
			sub: userId.value,
			email: email.value,
			type: TokenType.refreshToken,
		};

		return await this.jwtService.signAsync(refreshJwtBody, {
			secret: process.env.REFRESH_TOKEN_KEY,
			expiresIn: exp,
		});
	}

	async exec({ user }: IProps) {
		const accessToken = await this.buildAccessToken(user);
		const refreshToken = await this.buildRefreshToken(user.email, user.id);

		return { accessToken, refreshToken };
	}
}
