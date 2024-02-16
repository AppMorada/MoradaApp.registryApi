import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LoggerAdapter } from '@app/adapters/logger';
import { HmacInviteGuard } from '@app/auth/guards/hmac-invite.guard';
import { ApartmentNumber, Block, Email } from '@app/entities/VO';
import { ValueObject } from '@app/entities/entities';
import { Invite } from '@app/entities/invite';
import { User } from '@app/entities/user';
import { UserMapper } from '@app/mapper/user';
import { CreateTokenService } from '@app/services/createToken.service';
import { CreateUserService } from '@app/services/createUser.service';
import { GenInviteService } from '@app/services/genInvite.service';
import { CreateUserDTO } from '@infra/http/DTO/createUser.DTO';
import { InviteUserDTO } from '@infra/http/DTO/inviteUser.DTO';
import { Request, Response } from 'express';
import { USER_PREFIX } from '../consts';
import { validateObligatoryFieldsForCommonUser } from '@infra/http/DTO/conditionalsValidations/commonUserCreation';

@Controller(USER_PREFIX)
export class CreateUserController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly createUser: CreateUserService,
		private readonly createToken: CreateTokenService,
		private readonly genInvite: GenInviteService,
		private readonly logger: LoggerAdapter,
	) {}

	private async processTokens(res: Response, user: User) {
		const { accessToken, refreshToken, refreshTokenExp } =
			await this.createToken.exec({
				user,
			});

		const expires = new Date(Date.now() + refreshTokenExp);

		res.cookie('refresh-token', refreshToken, {
			expires,
			maxAge: refreshTokenExp * 1000,
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production' && true,
			sameSite: 'strict',
			signed: true,
		});

		return { accessToken };
	}

	@Throttle({
		default: {
			limit: 3,
			ttl: 60000,
		},
	})
	@UseGuards(HmacInviteGuard)
	@Post('accept')
	async createSimpleUser(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Body() body: CreateUserDTO,
	) {
		const invite = req.inMemoryData.invite as Invite;
		validateObligatoryFieldsForCommonUser({
			req,
			invite,
			body,
			logger: this.logger,
		});

		const { apartmentNumber, block, ...coreInfo } = body;
		const user = UserMapper.toClass({ ...coreInfo });
		await this.createUser.exec({
			user,
			invite,
			apartmentNumber: ValueObject.build(ApartmentNumber, apartmentNumber)
				.allowNullish()
				.exec(),
			block: ValueObject.build(Block, block).allowNullish().exec(),
		});
		return await this.processTokens(res, user);
	}

	@Throttle({
		default: {
			limit: 1,
			ttl: 30000,
		},
	})
	@Post('resend-invite')
	async resendInvite(
		@Res({ passthrough: true }) res: Response,
		@Body() body: InviteUserDTO,
	) {
		await this.genInvite.reexec({ email: new Email(body.email) });
		res.status(204);
	}
}
