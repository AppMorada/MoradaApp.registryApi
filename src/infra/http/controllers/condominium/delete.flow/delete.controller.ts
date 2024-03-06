import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { UUID } from '@app/entities/VO';
import { SuperAdminJwt } from '@app/auth/guards/super-admin-jwt.guard';
import { CONDOMINIUM_PREFIX } from '../consts';
import { DeleteCondominiumService } from '@app/services/condominium/delete.service';

@Controller(CONDOMINIUM_PREFIX)
export class DeleteCondominiumController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(private readonly deleteCondominium: DeleteCondominiumService) {}

	@Delete(':condominiumId')
	@UseGuards(SuperAdminJwt)
	@HttpCode(204)
	async deleteUser(@Param('condominiumId') id: string) {
		await this.deleteCondominium.exec({
			id: new UUID(id),
		});
	}
}
