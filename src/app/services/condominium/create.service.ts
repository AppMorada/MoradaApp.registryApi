import { CepGateway } from '@app/gateways/CEP.gateway';
import { CondominiumRepoWriteOps } from '@app/repositories/condominium/write';
import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import { CryptAdapter } from '@app/adapters/crypt';
import { randomBytes } from 'crypto';
import { Password } from '@app/entities/VO';
import { CondominiumMapper } from '@app/mapper/condominium';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

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
		password: string;
	};
}

@Injectable()
export class CreateCondominiumService implements IService {
	constructor(
		private readonly condominiumRepo: CondominiumRepoWriteOps,
		private readonly cepGate: CepGateway,
		private readonly cryptAdapter: CryptAdapter,
	) {}

	async exec(input: IProps) {
		const uniqueRegistry = new UniqueRegistry({
			email: input.user.email,
		});
		const user = new User({
			uniqueRegistryId: uniqueRegistry.id.value,
			name: input.user.name,
			password: input.user.password,
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
		await this.condominiumRepo.create({
			condominium,
			user,
			uniqueRegistry,
		});

		const parsedCondominium = CondominiumMapper.toObject(condominium);

		return { user, condominium: parsedCondominium, uniqueRegistry };
	}
}
