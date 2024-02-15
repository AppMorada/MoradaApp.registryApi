import { Body, Controller, Post } from '@nestjs/common';
import { CreateCondominiumService } from '@app/services/createCondominium.service';
import { CreateCondominiumDTO } from '@infra/http/DTO/createCondominium.DTO';
import { CondominiumMapper } from '@app/mapper/condominium';
import { Email, Level } from '@app/entities/VO';
import { GenInviteService } from '@app/services/genInvite.service';
import { CONDOMINIUM_PREFIX } from '../consts';
import { GetKeyService } from '@app/services/getKey.service';
import { KeysEnum } from '@app/repositories/key';

@Controller(CONDOMINIUM_PREFIX)
export class CreateCondominiumController {
	/** Acesse /api para ver as rotas disponíveis **/
	constructor(
		private readonly createCondominium: CreateCondominiumService,
		private readonly genInvite: GenInviteService,
		private readonly getKey: GetKeyService,
	) {}

	@Post()
	async create(@Body() body: CreateCondominiumDTO) {
		const { email: rawEmail, ...condominiumData } = body;

		const condominium = CondominiumMapper.toClass({ ...condominiumData });
		await this.createCondominium.exec({ condominium });

		const email = new Email(rawEmail);

		const { key } = await this.getKey.exec({
			name: KeysEnum.INVITE_SUPER_ADMIN_TOKEN_KEY,
		});
		await this.genInvite.exec({
			email,
			requiredLevel: new Level(2), // AVISO: SUPER ADMIN SENDO CONVIDADO
			key: key.actual.content,
			condominiumId: condominium.id,
		});
	}
}
