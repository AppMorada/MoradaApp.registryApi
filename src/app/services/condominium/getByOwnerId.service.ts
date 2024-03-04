import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumRepo } from '@app/repositories/condominium';

interface IProps {
	id: UUID;
}

@Injectable()
export class GetCondominiumByOwnerIdService implements IService {
	constructor(private readonly condominiumRepo: CondominiumRepo) {}

	async exec(input: IProps) {
		const data = await this.condominiumRepo.getCondominiumsByOwnerId({
			id: input.id,
		});
		return { condominiums: data };
	}
}
