import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumRequestRepoReadOps } from '@app/repositories/condominiumRequest/read';

interface IProps {
	condominiumId: string;
}

@Injectable()
export class ShowAllCondominiumRequestsService implements IService {
	constructor(
		private readonly condominiumRequest: CondominiumRequestRepoReadOps,
	) {}

	async exec(input: IProps) {
		const requests = await this.condominiumRequest.findByCondominiumId({
			id: new UUID(input.condominiumId),
		});

		return requests;
	}
}
