import { IAccessTokenBody, TokenType } from '@app/auth/tokenTypes';
import { Email } from '@app/entities/VO/email';
import { Password } from '@app/entities/VO/password';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';
import { UserRepo } from '@app/repositories/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface IProps {
	email: Email;
	password: Password;
}

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepo: UserRepo,
		private readonly jwtService: JwtService,
	) {}

	async exec(input: IProps) {
		const user = await this.userRepo.find({ email: input.email });

		if (!user || !user.password.equalTo(input.password))
			throw new ServiceErrors({
				message: 'Unauthorized',
				tag: ServiceErrorsTags.unauthorized,
			});

		const jwtBody: IAccessTokenBody = {
			sub: user.id,
			content: {
				email: user.email.value(),
				CPF: user.CPF.value(),
				name: user.name.value(),
				level: user.level.value(),
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				phoneNumber: user.phoneNumber.value(),
			},
			type: TokenType.accessToken,
		};

		const token = await this.jwtService.signAsync(jwtBody, {
			secret: process.env.ACCESS_TOKEN_KEY,
			expiresIn: 1000 * 60 * 60 * 5,
		});

		return { token };
	}
}
