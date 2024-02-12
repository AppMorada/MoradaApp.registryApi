import { Body, Controller, Post } from '@nestjs/common';
import { CreateCondominiumService } from '@app/services/createCondominium.service';
import { CreateCondominiumDTO } from '@infra/http/DTO/createCondominium.DTO';
import { CondominiumMapper } from '@app/mapper/condominium';
import { Email, Level } from '@app/entities/VO';
import { GenInviteService } from '@app/services/genInvite.service';
import { CONDOMINIUM_PREFIX } from '../consts';

@Controller(CONDOMINIUM_PREFIX)
export class CreateCondominiumController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly createCondominium: CreateCondominiumService,
		private readonly genInvite: GenInviteService,
	) {}

	@Post()
	async create(@Body() body: CreateCondominiumDTO) {
		const { email: rawEmail, ...condominiumData } = body;

		const condominium = CondominiumMapper.toClass({ ...condominiumData });
		await this.createCondominium.exec({ condominium });

		const email = new Email(rawEmail);
		await this.genInvite.exec({
			email,
			requiredLevel: new Level(2), // AVISO: SUPER ADMIN SENDO CONVIDADO
			key: process.env.INVITE_SUPER_ADMIN_TOKEN_KEY,
			condominiumId: condominium.id,
		});
	}
}
