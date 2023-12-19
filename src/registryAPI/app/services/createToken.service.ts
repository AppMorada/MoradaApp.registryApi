import {
	IAccessTokenBody,
	IRefreshTokenBody,
	TokenType,
} from '@registry:app/auth/tokenTypes';
import { ApartmentNumber } from '@registry:app/entities/VO/apartmentNumber';
import { Block } from '@registry:app/entities/VO/block';
import { Email } from '@registry:app/entities/VO/email';
import { Level } from '@registry:app/entities/VO/level';
import { Name } from '@registry:app/entities/VO/name';
import { PhoneNumber } from '@registry:app/entities/VO/phoneNumber';
import { User } from '@registry:app/entities/user';
import { OTPRepo } from '@registry:app/repositories/otp';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface IUserDataCore {
	id: string;
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
	removeOTP?: boolean;
}

@Injectable()
export class CreateTokenService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly otpRepo: OTPRepo,
	) {}

	private async buildAccessToken(user: User | IUserDataCore) {
		const exp = parseInt(process.env.ACCESS_TOKEN_EXP as string);
		const accessJwtBody: Omit<IAccessTokenBody, 'iat' | 'exp'> = {
			sub: user.id,
			content: {
				email: user.email.value,
				block: user.block ? user.block.value : null,
				apartmentNumber: user.apartmentNumber
					? user.apartmentNumber.value
					: null,
				name: user.name.value,
				level: user.level.value,
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

	private async buildRefreshToken(email: Email, userId: string) {
		const exp = parseInt(process.env.REFRESH_TOKEN_EXP as string);
		const refreshJwtBody: Omit<IRefreshTokenBody, 'iat' | 'exp'> = {
			sub: userId,
			email: email.value,
			type: TokenType.refreshToken,
		};

		return await this.jwtService.signAsync(refreshJwtBody, {
			secret: process.env.REFRESH_TOKEN_KEY,
			expiresIn: exp,
		});
	}

	async exec({ user, removeOTP }: IProps) {
		if (removeOTP) await this.otpRepo.delete({ email: user.email });

		const accessToken = await this.buildAccessToken(user);
		const refreshToken = await this.buildRefreshToken(user.email, user.id);

		return { accessToken, refreshToken };
	}
}
