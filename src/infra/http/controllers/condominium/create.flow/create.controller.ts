import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	SetMetadata,
	UseGuards,
} from '@nestjs/common';
import { CreateCondominiumService } from '@app/services/condominium/create.service';
import { CreateCondominiumDTO } from '@infra/http/DTO/condominium/create.DTO';
import { CONDOMINIUM_PREFIX } from '../consts';
import { User } from '@app/entities/user';
import { Request } from 'express';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { CheckTFACodeGuard } from '@app/auth/guards/checkTFACode.guard';
import { KeysEnum } from '@app/repositories/key';
import { guardMetadataValues } from '@app/auth/guards/_metadata';
import { Throttle } from '@nestjs/throttler';

@Controller(CONDOMINIUM_PREFIX)
export class CreateCondominiumController {
	constructor(
		private readonly createCondominium: CreateCondominiumService,
		private readonly genTFA: GenTFAService,
	) {}

	@Throttle({
		default: {
			limit: 3,
			ttl: 60000,
		},
	})
	@Post('validate-account')
	@HttpCode(202)
	@UseGuards(JwtGuard)
	async validateAccount(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		const uniqueRegistry = req.inMemoryData
			.uniqueRegistry as UniqueRegistry;

		await this.genTFA.exec({
			email: uniqueRegistry.email,
			userId: user.id,
			keyName: KeysEnum.CONDOMINIUM_VALIDATION_KEY,
			existentUserContent: { user, uniqueRegistry },
		});
	}

	@Throttle({
		default: {
			limit: 5,
			ttl: 60000,
		},
	})
	@Post()
	@SetMetadata(
		guardMetadataValues.checkTFACodeGuard.keyName,
		KeysEnum.CONDOMINIUM_VALIDATION_KEY,
	)
	@UseGuards(CheckTFACodeGuard)
	async create(@Req() req: Request, @Body() body: CreateCondominiumDTO) {
		const user = req.inMemoryData.user as User;
		const { condominium } = await this.createCondominium.exec({
			...body,
			ownerId: user.id.value,
		});

		return { condominium };
	}
}
