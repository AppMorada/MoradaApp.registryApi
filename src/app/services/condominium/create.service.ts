import { CepGateway } from '@app/gateways/CEP.gateway';
import { CondominiumRepoWriteOps } from '@app/repositories/condominium/write';
import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { CondominiumMapper } from '@app/mapper/condominium';
import { User } from '@app/entities/user';

interface IProps {
	user: User;
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

	async exec({ user, ...input }: IProps) {
		const condominium = CondominiumMapper.toClass({
			...input,
			ownerId: user.id.value,
		});

		await this.cepGate.check(condominium.CEP.value);
		await this.condominiumRepo.create({ condominium, user });

		return {
			condominium: CondominiumMapper.toObject(condominium),
		};
	}
}
