import { CryptAdapter } from '@app/adapters/crypt';
import { Password } from '@app/entities/VO';
import { User } from '@app/entities/user';
import { Injectable } from '@nestjs/common';
import { InviteRepo } from '@app/repositories/invite';
import { IService } from '../_IService';

interface IProps {
	user: User;
}

/** Serviço responsável por criar um novo usuário */
@Injectable()
export class CreateUserService implements IService {
	constructor(
		private readonly inviteRepo: InviteRepo,
		private readonly crypt: CryptAdapter,
	) {}

	async exec({ user }: IProps) {
		const hashPass = await this.crypt.hash(user.password.value);

		const userCopy = user.dereference();
		userCopy.password = new Password(hashPass);

		const invite = await this.inviteRepo.find({
			key: userCopy.CPF,
			safeSearch: true,
		});
		await this.inviteRepo.transferToUserResources({
			user: userCopy,
			condominiumId: invite.condominiumId,
		});
	}
}
