import { CryptAdapter } from '@app/adapters/crypt';
import { CPF, Password } from '@app/entities/VO';
import { User } from '@app/entities/user';
import { Injectable } from '@nestjs/common';
import { InviteRepo } from '@app/repositories/invite';
import { IService } from '../_IService';
import { Invite } from '@app/entities/invite';

interface IProps {
	user: User;
	invite: Invite;
	CPF: string;
}

/** Serviço responsável por criar um novo usuário */
@Injectable()
export class CreateUserService implements IService {
	constructor(
		private readonly inviteRepo: InviteRepo,
		private readonly crypt: CryptAdapter,
	) {}

	async exec({ user, invite, CPF: cpf }: IProps) {
		const hashPass = await this.crypt.hash(user.password.value);

		const userCopy = user.dereference();
		userCopy.password = new Password(hashPass);

		await this.inviteRepo.transferToUserResources({
			user: userCopy,
			invite,
			CPF: new CPF(cpf),
		});
	}
}
