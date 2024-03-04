import { CepGateway } from '@app/gateways/CEP.gateway';
import { CondominiumRepo } from '@app/repositories/condominium';
import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import { CryptAdapter } from '@app/adapters/crypt';
import { randomBytes } from 'crypto';
import { Password } from '@app/entities/VO';
import { CondominiumMapper } from '@app/mapper/condominium';

interface IProps {
	condominium: {
		name: string;
		CEP: string;
		CNPJ: string;
		num: number;
	};
	user: {
		name: string;
		email: string;
		CPF: string;
		password: string;
	};
}

/** Serviço responsável por criar um novo condomínio */
@Injectable()
export class CreateCondominiumService implements IService {
	constructor(
		private readonly condominiumRepo: CondominiumRepo,
		private readonly cepGate: CepGateway,
		private readonly cryptAdapter: CryptAdapter,
	) {}

	async exec(input: IProps) {
		const user = new User({
			name: input.user.name,
			email: input.user.email,
			password: input.user.password,
			CPF: input.user.CPF,
			tfa: false,
		});
		user.password = new Password(
			await this.cryptAdapter.hash(user.password.value),
		);

		const seedKey = await this.cryptAdapter.hash(
			randomBytes(200).toString('hex'),
		);
		const condominium = new Condominium({
			ownerId: user.id.value,
			name: input.condominium.name,
			CNPJ: input.condominium.CNPJ,
			CEP: input.condominium.CEP,
			seedKey,
			num: input.condominium.num,
		});

		await this.cepGate.check(condominium.CEP.value);
		await this.condominiumRepo.create({ condominium, user });

		return { user, condominium: CondominiumMapper.toObject(condominium) };
	}
}
