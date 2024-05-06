import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumReadOps } from '@app/repositories/condominium/read';

interface IProps {
	id: UUID;
}

@Injectable()
export class GetCondominiumByOwnerIdService implements IService {
	constructor(
		private readonly condominiumRepoGetByOwnerId: CondominiumReadOps.GetByOwnerId,
	) {}

	async exec(input: IProps) {
		const data = await this.condominiumRepoGetByOwnerId.exec({
			id: input.id,
		});
		return { condominiums: data };
	}
}
