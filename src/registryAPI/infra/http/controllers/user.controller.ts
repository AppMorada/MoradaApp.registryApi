import { CreateUserService } from '@registry:app/services/createUser.service';
import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from '../DTO/createUser.DTO';
import { UserMapper } from '@registry:app/mapper/user';
import { Request, Response } from 'express';
import { CreateTokenService } from '@registry:app/services/createToken.service';
import { HmacInviteGuard } from '@registry:app/auth/guards/hmac-invite.guard';
import { LayersEnum, LoggerAdapter } from '@registry:app/adapters/logger';
import { CheckPasswordGuard } from '@registry:app/auth/guards/checkPassword.guard';
import { User } from '@registry:app/entities/user';
import { GenTFAService } from '@registry:app/services/genTFA.service';
import { CheckTFACodeGuard } from '@registry:app/auth/guards/checkTFACode.guard';
import { Throttle } from '@nestjs/throttler';
import { RefreshTokenGuard } from '@registry:app/auth/guards/refreshToken.guard';
import { Invite } from '@registry:app/entities/invite';
import { ApartmentNumber, Block } from '@registry:app/entities/VO';
import { ValueObject } from '@registry:app/entities/entities';
import { JwtGuard } from '@registry:app/auth/guards/jwt.guard';
import { DeleteUserService } from '@registry:app/services/deleteUser.service';
import { GetCondominiumRelUserService } from '@registry:app/services/getCondominiumRel.service';
import { GenOldTFASevice } from '@registry:app/services/genTFACode.old.service';
import { CheckOTPGuard } from '@registry:app/auth/guards/checkOTP.guard';

@Throttle({
	default: {
		limit: 3,
		ttl: 60000,
	},
})
@Controller('user')
export class UserController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly getCondominiumRelUserService: GetCondominiumRelUserService,
		private readonly createUser: CreateUserService,
		private readonly createToken: CreateTokenService,
		private readonly deleteUserService: DeleteUserService,
		private readonly genTFA: GenTFAService,
		private readonly oldTFA: GenOldTFASevice,
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

	@UseGuards(CheckPasswordGuard)
	@Post('launch-tfa')
	@HttpCode(204)
	async launchTFA(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		await this.genTFA.exec({
			email: user.email,
			userId: user.id,
		});
	}

	@UseGuards(JwtGuard)
	@Delete()
	@HttpCode(204)
	async deleteAccount(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		await this.deleteUserService.exec({ target: user.email });
	}

	@UseGuards(JwtGuard)
	@Get()
	@HttpCode(200)
	async getAccount(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		const { condominiumRels } =
			await this.getCondominiumRelUserService.exec({ userId: user.id });

		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { password: _, ...userAsObject } = UserMapper.toObject(user);
		return {
			user: {
				...userAsObject,
				condominiumRels,
			},
		};
	}

	@UseGuards(CheckPasswordGuard)
	@Post('/old/launch-tfa')
	@HttpCode(204)
	async launchTFAOld(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		await this.oldTFA.exec({
			email: user.email,
			userId: user.id,
		});
	}

	@UseGuards(CheckOTPGuard)
	@Post('/old/login')
	@HttpCode(200)
	async oldLogin(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	) {
		const user = req.inMemoryData.user as User;
		return await this.processTokens(res, user);
	}

	@UseGuards(CheckTFACodeGuard)
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
	@Get('get-tokens')
	@HttpCode(200)
	async refreshToken(
		@Res({ passthrough: true }) res: Response,
		@Req() req: Request,
	) {
		const user = req.inMemoryData.user as User;
		this.createToken.exec({ user });
		return await this.processTokens(res, user);
	}
}
