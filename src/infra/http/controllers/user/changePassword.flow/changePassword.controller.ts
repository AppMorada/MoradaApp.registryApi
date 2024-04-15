import {
	Body,
	Controller,
	HttpCode,
	Patch,
	Post,
	Req,
	SetMetadata,
	UseGuards,
} from '@nestjs/common';
import { USER_PREFIX } from '../consts';
import { UpdateUserService } from '@app/services/user/update.service';
import { Throttle } from '@nestjs/throttler';
import { GenTFAService } from '@app/services/login/genTFA.service';
import { Request } from 'express';
import { User } from '@app/entities/user';
import { KeysEnum } from '@app/repositories/key';
import { guardMetadataValues } from '@app/auth/guards/_metadata';
import { CheckTFACodeGuard } from '@app/auth/guards/checkTFACode.guard';
import { ChangePasswordDTO } from '@infra/http/DTO/user/changePassword.DTO';
import { RequestPasswordChangeDTO } from '@infra/http/DTO/user/requestPasswordChange.DTO';
import { Email } from '@app/entities/VO';
import { ServiceErrors, ServiceErrorsTags } from '@app/errors/services';

@Throttle({
	default: {
		limit: 1,
		ttl: 120000,
	},
})
@Controller(USER_PREFIX)
export class ChangePasswordController {
	constructor(
		private readonly updateUserService: UpdateUserService,
		private readonly genTFA: GenTFAService,
	) {}

	@Post('/request-password-update')
	@HttpCode(202)
	async requestPasswordUpdate(@Body() body: RequestPasswordChangeDTO) {
		await this.genTFA
			.exec({
				searchUserKey: new Email(body.email),
				keyName: KeysEnum.CHANGE_PASSWORD_KEY,
			})
			.catch((err) => {
				// Tags de unauthorized 'obfuscam' o erro no lado do client
				throw new ServiceErrors({
					tag: ServiceErrorsTags.unauthorized,
					message: err.message,
				});
			});
	}

	@Patch('/change-password')
	@SetMetadata(
		guardMetadataValues.checkTFACodeGuard.keyName,
		KeysEnum.CHANGE_PASSWORD_KEY,
	)
	@UseGuards(CheckTFACodeGuard)
	async changePassword(@Req() req: Request, @Body() body: ChangePasswordDTO) {
		const user = req.inMemoryData.user as User;
		await this.updateUserService.exec({
			id: user.id.value,
			password: body.password,
		});
	}
}
