import { Email } from '@registry:app/entities/VO';
import { UserRepo } from '@registry:app/repositories/user';
import { Injectable } from '@nestjs/common';
import { IService } from './_IService';
import {
	ServiceErrors,
	ServiceErrorsTags,
} from '@registry:app/errors/services';

interface IProps {
	target: Email;
	actualUser?: Email;
}

/** Serviço responsável por deletar um usuário */
@Injectable()
export class DeleteUserService implements IService {
	constructor(private readonly userRepo: UserRepo) {}

	async exec({ target, actualUser }: IProps) {
		if (actualUser && target.equalTo(actualUser))
			throw new ServiceErrors({
				message:
					'Não é possível deletar você mesmo utilizando os recursos de administradores',
				tag: ServiceErrorsTags.wrongServiceUsage,
			});

		await this.userRepo.delete({ key: target });
	}
}
