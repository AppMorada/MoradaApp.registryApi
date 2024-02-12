import { Condominium } from '@app/entities/condominium';
import { CepGateway } from '@app/gateways/CEP.gateway';
import { CondominiumRepo } from '@app/repositories/condominium';
import { Injectable } from '@nestjs/common';
import { IService } from './_IService';

interface IProps {
	condominium: Condominium;
}

/** Serviço responsável por criar um novo condomínio */
@Injectable()
export class CreateCondominiumService implements IService {
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
