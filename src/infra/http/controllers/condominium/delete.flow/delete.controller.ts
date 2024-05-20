import { Controller, Delete, HttpCode, Req, UseGuards } from '@nestjs/common';
import { SuperAdminJwt } from '@app/auth/guards/super-admin-jwt.guard';
import { CONDOMINIUM_PREFIX } from '../consts';
import { DeleteCondominiumService } from '@app/services/condominium/delete.service';
import { Request } from 'express';
import { Condominium } from '@app/entities/condominium';

@Controller(CONDOMINIUM_PREFIX)
export class DeleteCondominiumController {
	constructor(private readonly deleteCondominium: DeleteCondominiumService) {}

	@Delete(':condominiumId')
	@UseGuards(SuperAdminJwt)
	@HttpCode(204)
	async deleteUser(@Req() req: Request) {
		const condominium = req.inMemoryData?.condominium as Condominium;
		await this.deleteCondominium.exec({ condominium });
	}
}
