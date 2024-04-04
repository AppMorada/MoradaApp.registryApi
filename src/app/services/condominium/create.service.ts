import { CepGateway } from '@app/gateways/CEP.gateway';
import { CondominiumRepoWriteOps } from '@app/repositories/condominium/write';
import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { CondominiumMapper } from '@app/mapper/condominium';

interface IProps {
	ownerId: string;
	name: string;
	CEP: string;
	CNPJ: string;
	reference?: string | null;
	complement?: string | null;
	district: string;
	city: string;
	state: string;
	num: number;
}

@Injectable()
export class CreateCondominiumService implements IService {
	constructor(
		private readonly condominiumRepo: CondominiumRepoWriteOps,
		private readonly cepGate: CepGateway,
	) {}

	async exec(input: IProps) {
		const condominium = CondominiumMapper.toClass({ ...input });

		await this.cepGate.check(condominium.CEP.value);
		await this.condominiumRepo.create({ condominium });

		return {
			condominium: CondominiumMapper.toObject(condominium),
		};
	}
}
