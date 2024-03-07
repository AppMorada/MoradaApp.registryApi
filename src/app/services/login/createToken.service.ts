import {
	IAccessTokenBody,
	IRefreshTokenBody,
	TokenType,
} from '@app/auth/tokenTypes';
import {
	ApartmentNumber,
	Block,
	Email,
	Level,
	Name,
	PhoneNumber,
	UUID,
} from '@app/entities/VO';
import { User } from '@app/entities/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IService } from '../_IService';
import { Key } from '@app/entities/key';
import { GetKeyService } from '../key/getKey.service';
import { KeysEnum } from '@app/repositories/key';

interface IUserDataCore {
	id: UUID;
	email: Email;
	block?: Block | null;
	apartmentNumber?: ApartmentNumber | null;
	name: Name;
	level: Level;
	createdAt: Date;
	updatedAt: Date;
	phoneNumber?: PhoneNumber;
}

interface IProps {
	user: User | IUserDataCore;
}

@Injectable()
export class CreateTokenService implements IService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly getKey: GetKeyService,
	) {}

	private async buildAccessToken(
		user: User | IUserDataCore,
		accessTokenKey: Key,
	) {
		const exp = accessTokenKey.ttl;
		const accessJwtBody: Omit<IAccessTokenBody, 'iat' | 'exp'> = {
			sub: user.id.value,
			content: {
				email: user.email.value,
				name: user.name.value,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				phoneNumber: user.phoneNumber?.value,
			},
			type: TokenType.accessToken,
		};

		return await this.jwtService.signAsync(accessJwtBody, {
			secret: accessTokenKey.actual.content,
			expiresIn: Math.floor(exp / 1000),
		});
	}

	private async buildRefreshToken(
		email: Email,
		userId: UUID,
		refreshTokenKey: Key,
	) {
		const exp = refreshTokenKey.ttl;
		const refreshJwtBody: Omit<IRefreshTokenBody, 'iat' | 'exp'> = {
			sub: userId.value,
			email: email.value,
			type: TokenType.refreshToken,
		};

		return await this.jwtService.signAsync(refreshJwtBody, {
			secret: refreshTokenKey.actual.content,
			expiresIn: Math.floor(exp / 1000),
		});
	}

	async exec({ user }: IProps) {
		const { key: accessTokenKey } = await this.getKey.exec({
			name: KeysEnum.ACCESS_TOKEN_KEY,
		});
		const { key: refreshTokenKey } = await this.getKey.exec({
			name: KeysEnum.REFRESH_TOKEN_KEY,
		});

		const accessToken = await this.buildAccessToken(user, accessTokenKey);
		const refreshToken = await this.buildRefreshToken(
			user.email,
			user.id,
			refreshTokenKey,
		);

		return {
			accessToken,
			accessTokenExp: Math.floor(accessTokenKey.ttl / 1000),
			refreshToken,
			refreshTokenExp: Math.floor(refreshTokenKey.ttl / 1000),
		};
	}
}
