import { CryptAdapter } from '@app/adapters/crypt';
import { Password } from '@app/entities/VO';
import { User } from '@app/entities/user';
import { Injectable } from '@nestjs/common';
import { IService } from '../../_IService';
import { EnterpriseMemberRepo } from '@app/repositories/enterpriseMember';
import { EnterpriseMember } from '@app/entities/enterpriseMember';

interface IProps {
	user: User;
	condominiumId: string;
	CPF: string;
}

/** Serviço responsável por criar um novo usuário de empresa */
@Injectable()
export class CreateEnterpriseUserService implements IService {
	constructor(
		private readonly crypt: CryptAdapter,
		private readonly enterpriseMemberRepo: EnterpriseMemberRepo,
	) {}

	async exec({ user, condominiumId, CPF }: IProps) {
		const hashPass = await this.crypt.hash(user.password.value);

		const userCopy = user.dereference();
		userCopy.password = new Password(hashPass);

		const member = new EnterpriseMember({
			condominiumId,
			userId: user.id.value,
			CPF,
		});

		await this.enterpriseMemberRepo.create({ member, user: userCopy });
	}
}
