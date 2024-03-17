import {
	IAccessTokenBody,
	IRefreshTokenBody,
	TokenType,
} from '@app/auth/tokenTypes';
import { Email, UUID } from '@app/entities/VO';
import { User } from '@app/entities/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IService } from '../_IService';
import { Key } from '@app/entities/key';
import { GetKeyService } from '../key/getKey.service';
import { KeysEnum } from '@app/repositories/key';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

interface IProps {
	user: User;
	uniqueRegistry: UniqueRegistry;
}

@Injectable()
export class CreateTokenService implements IService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly getKey: GetKeyService,
	) {}

	private async buildAccessToken(
		user: User,
		uniqueRegistry: UniqueRegistry,
		accessTokenKey: Key,
	) {
		const exp = accessTokenKey.ttl;
		const accessJwtBody: Omit<IAccessTokenBody, 'iat' | 'exp'> = {
			sub: user.id.value,
			content: {
				email: uniqueRegistry.email.value,
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

	async exec({ user, uniqueRegistry }: IProps) {
		const { key: accessTokenKey } = await this.getKey.exec({
			name: KeysEnum.ACCESS_TOKEN_KEY,
		});
		const { key: refreshTokenKey } = await this.getKey.exec({
			name: KeysEnum.REFRESH_TOKEN_KEY,
		});

		const accessToken = await this.buildAccessToken(
			user,
			uniqueRegistry,
			accessTokenKey,
		);
		const refreshToken = await this.buildRefreshToken(
			uniqueRegistry.email,
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
