import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UUID } from '@app/entities/VO';
import { CONDOMINIUM_PREFIX } from '../consts';
import { GetCondominiumService } from '@app/services/condominium/get.service';
import { JwtGuard } from '@app/auth/guards/jwt.guard';
import { Request } from 'express';
import { User } from '@app/entities/user';
import { GetCondominiumByOwnerIdService } from '@app/services/condominium/getByOwnerId.service';

@Controller(CONDOMINIUM_PREFIX)
export class GetCondominiumController {
	constructor(
		private readonly getCondominium: GetCondominiumService,
		private readonly getCondominiumsByOwnerId: GetCondominiumByOwnerIdService,
	) {}

	@UseGuards(JwtGuard)
	@Get('/my')
	async getMy(@Req() req: Request) {
		const user = req.inMemoryData.user as User;
		return await this.getCondominiumsByOwnerId.exec({ id: user.id });
	}

	@Get(':condominiumId')
	async get(@Param('condominiumId') id: string) {
		return await this.getCondominium.exec({ id: new UUID(id) });
	}
}
