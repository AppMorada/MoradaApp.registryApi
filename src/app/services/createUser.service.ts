import { CryptAdapter } from '@app/adapters/crypt';
import { ApartmentNumber, Block, Password } from '@app/entities/VO';
import { User } from '@app/entities/user';
import { Injectable } from '@nestjs/common';
import { InviteRepo } from '@app/repositories/invite';
import { IService } from './_IService';
import { CondominiumRelUser } from '@app/entities/condominiumRelUser';
import { Invite } from '@app/entities/invite';

interface IProps {
	user: User;
	invite: Invite;
	apartmentNumber?: ApartmentNumber | null;
	block?: Block | null;
}

/** Serviço responsável por criar um novo usuário */
@Injectable()
export class CreateUserService implements IService {
	constructor(
		private readonly inviteRepo: InviteRepo,
		private readonly crypt: CryptAdapter,
	) {}

	async exec({ ...input }: IProps) {
		const hashPass = await this.crypt.hash(input.user.password.value);

		const user = input.user.dereference();
		user.password = new Password(hashPass);

		const condominiumRelUser = new CondominiumRelUser({
			apartmentNumber: input.apartmentNumber
				? input.apartmentNumber.value
				: undefined,
			block: input.block ? input.block.value : undefined,
			level: input.invite.type.value,
			condominiumId: input.invite.condominiumId.value,
			userId: input.user.id.value,
		});

		await this.inviteRepo.transferToUserResources({
			user,
			condominiumRelUser,
		});
	}
}
