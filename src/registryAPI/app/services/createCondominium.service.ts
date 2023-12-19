import { Condominium } from '@registry:app/entities/condominium';
import { CepGateway } from '@registry:app/gateways/CEP.gateway';
import { CondominiumRepo } from '@registry:app/repositories/condominium';
import { Injectable } from '@nestjs/common';

interface IProps {
	condominium: Condominium;
}

@Injectable()
export class CreateCondominiumService {
	constructor(
		private readonly condominiumRepo: CondominiumRepo,
		private readonly cepGate: CepGateway,
	) {}

	async exec(input: IProps) {
		await this.cepGate.check(input.condominium.CEP.value);

		await this.condominiumRepo.create({
			condominium: input.condominium,
		});
	}
}
