import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { CONDOMINIUM_PREFIX } from '../consts';
import { UpdateCondominiumService } from '@app/services/condominium/update.service';
import { UpdateCondominiumDTO } from '@infra/http/DTO/condominium/update.DTO';
import { SuperAdminJwt } from '@app/auth/guards/super-admin-jwt.guard';

@Controller(CONDOMINIUM_PREFIX)
export class UpdateCondominiumController {
	constructor(private readonly updateCondominium: UpdateCondominiumService) {}

	@UseGuards(SuperAdminJwt)
	@Patch(':condominiumId')
	async update(
		@Body() body: UpdateCondominiumDTO,
		@Param('condominiumId') id: string,
	) {
		await this.updateCondominium.exec({ id, ...body });
	}
}
