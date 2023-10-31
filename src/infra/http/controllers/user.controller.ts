import { CreateUserService } from '@app/services/createUser.service';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from '../DTO/createUser.DTO';
import { UserMapper } from '@app/mapper/user';
import { Request, Response } from 'express';
import { CreateTokenService } from '@app/services/createToken.service';
import { OTP } from '@app/entities/OTP';
import { HmacInviteGuard } from '@app/auth/guards/hmac-invite.guard';
import { ApartmentNumber } from '@app/entities/VO/apartmentNumber';
import { Block } from '@app/entities/VO/block';
import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';
import { CheckPasswordGuard } from '@app/auth/guards/checkPassword.guard';
import { User } from '@app/entities/user';
import { GenTFAService } from '@app/services/genTFA.service';
import { CheckOTPGuard } from '@app/auth/guards/checkOTP.guard';
import { Throttle } from '@nestjs/throttler';
import { RefreshTokenGuard } from '@app/auth/guards/refreshToken.guard';

@Throttle({
	default: {
		limit: 3,
		ttl: 60000,
	},
})
@Controller('user')
export class UserController {
	constructor(
		private readonly createUser: CreateUserService,
		private readonly createToken: CreateTokenService,
		private readonly genTFA: GenTFAService,
		private readonly logger: LoggerAdapter,
	) {}

	private async processTokens(res: Response, user: User) {
		const { accessToken, refreshToken } = await this.createToken.exec({
			user,
			removeOTP: true,
		});

		const expires = new Date(
			Date.now() + Number(process.env.REFRESH_TOKEN_EXP),
		);

		res.cookie('refresh-token', refreshToken, {
			expires,
			maxAge: parseInt(process.env.REFRESH_TOKEN_EXP as string) * 1000,
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production' && true,
			sameSite: 'strict',
			signed: true,
		});

		return { accessToken };
	}

	@UseGuards(HmacInviteGuard)
	@Post('accept')
	async createSimpleUser(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() body: CreateUserDTO,
	) {
		const otp = req.inMemoryData.otp as OTP;

		// PASSAR PARA OUTRO DOMÍNIO
		if (
			(!body.apartmentNumber && otp.requiredLevel.value === 0) ||
			(!body.block && otp.requiredLevel.value === 0)
		) {
			this.logger.error({
				name: 'Omissão de campos',
				layer: LayersEnum.dto,
				description:
					'apartmentNumber e block não devem ser omitidos em usuários comuns',
			});

			throw new BadRequestException({
				message: [
					'apartmentNumber e block não devem ser omitidos em usuários comuns',
				],
				error: 'Bad Request',
				statusCode: 400,
			});
		}

		const user = UserMapper.toClass({
			...body,
			apartmentNumber: body.apartmentNumber
				? new ApartmentNumber(body.apartmentNumber)
				: null,
			block: body.block ? new Block(body.block) : null,
			level: otp.requiredLevel?.value || 0,
			condominiumId: otp.condominiumId,
		});

		await this.createUser.exec({ user });
		return await this.processTokens(res, user);
	}

	@UseGuards(CheckPasswordGuard)
	@Post('launch-tfa')
	@HttpCode(204)
	async launchTFA(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		await this.genTFA.exec({
			email: user.email,
			userId: user.id,
			condominiumId: user.condominiumId,
		});
	}

	@UseGuards(CheckOTPGuard)
	@Post('login')
	@HttpCode(200)
	async login(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	) {
		const user = req.inMemoryData.user as User;
		return await this.processTokens(res, user);
	}

	@UseGuards(RefreshTokenGuard)
	@Post('refresh-token')
	@HttpCode(200)
	async refreshToken(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	) {
		const user = req.inMemoryData.user as User;
		this.createToken.exec({ user, removeOTP: true });
		return await this.processTokens(res, user);
	}
}
