import { Body, Controller, Post } from '@nestjs/common';
import { CreateCondominiumService } from '@app/services/createCondominium.service';
import { CreateCondominiumDTO } from '../DTO/createCondominium.DTO';
import { CondominiumMapper } from '@app/mapper/condominium';
import { Email } from '@app/entities/VO/email';

@Controller('/condominium')
export class CondominiumController {
	constructor(private readonly createCondominium: CreateCondominiumService) {}

	@Post()
	async create(@Body() body: CreateCondominiumDTO) {
		const { email, ...condominiumData } = body;
		const condominium = CondominiumMapper.toClass({ ...condominiumData });

		await this.createCondominium.exec({
			condominium,
			email: new Email(email),
		});
	}
}
