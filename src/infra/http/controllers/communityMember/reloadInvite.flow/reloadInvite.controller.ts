import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { Throttle } from '@nestjs/throttler';
import { ReloadInviteUserDTO } from '@infra/http/DTO/members/community/reloadinvite.DTO';
import { ReloadInviteService } from '@app/services/invites/reloadInvite.service';

@Controller(CONDOMINIUM_PREFIX)
export class ReloadInviteCommunityMemberController {
	constructor(private readonly reloadInvite: ReloadInviteService) {}

	@Throttle({
		default: {
			limit: 1,
			ttl: 30000,
		},
	})
	@Post('invite/reload')
	@HttpCode(204)
	async resendInvite(@Body() body: ReloadInviteUserDTO) {
		await this.reloadInvite.exec({ recipient: body.email });
	}
}
