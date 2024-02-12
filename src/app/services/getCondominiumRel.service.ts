import { Injectable } from '@nestjs/common';
import { UUID } from '@app/entities/VO';
import { UserRepo } from '@app/repositories/user';
import { IService } from './_IService';

interface IProps {
	userId: UUID;
}

/** Serviço responsável por ler e retornar a relação que um usuário tem com seus condominios */
@Injectable()
export class GetCondominiumRelUserService implements IService {
	constructor(private readonly userRepo: UserRepo) {}

	async exec({ userId }: IProps) {
		const condominiumRelUserGroup =
			await this.userRepo.getAllCondominiumRelation({ userId });
		return {
			condominiumRels: condominiumRelUserGroup,
		};
	}
}
