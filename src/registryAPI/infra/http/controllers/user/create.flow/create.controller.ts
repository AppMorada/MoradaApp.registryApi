import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LayersEnum, LoggerAdapter } from '@registry:app/adapters/logger';
import { HmacInviteGuard } from '@registry:app/auth/guards/hmac-invite.guard';
import { ApartmentNumber, Block, Email } from '@registry:app/entities/VO';
import { ValueObject } from '@registry:app/entities/entities';
import { Invite } from '@registry:app/entities/invite';
import { User } from '@registry:app/entities/user';
import { ServiceErrors } from '@registry:app/errors/services';
import { UserMapper } from '@registry:app/mapper/user';
import { CreateTokenService } from '@registry:app/services/createToken.service';
import { CreateUserService } from '@registry:app/services/createUser.service';
import { GenInviteService } from '@registry:app/services/genInvite.service';
import { CreateUserDTO } from '@registry:infra/http/DTO/createUser.DTO';
import { InviteUserDTO } from '@registry:infra/http/DTO/inviteUser.DTO';
import { Request, Response } from 'express';
import { USER_PREFIX } from '../consts';

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
		const { accessToken, refreshToken } = await this.createToken.exec({
			user,
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
		// PASSAR PARA OUTRO DOMÍNIO
		if (
			(!body.apartmentNumber && invite.type.value === 0) ||
			(!body.block && invite.type.value === 0)
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
		await this.genInvite
			.reexec({ email: new Email(body.email) })
			.catch((err) => {
				if (err instanceof ServiceErrors) throw err;

				res.status(204);
			});

		res.status(204);
	}
}
