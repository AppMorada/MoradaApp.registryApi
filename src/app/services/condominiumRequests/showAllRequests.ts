import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumRequestReadOps } from '@app/repositories/condominiumRequest/read';

interface IProps {
	condominiumId: string;
}

@Injectable()
export class ShowAllCondominiumRequestsService implements IService {
	constructor(
		private readonly condominiumRequestFindByCondominiumId: CondominiumRequestReadOps.FindByCondominiumId,
	) {}

	async exec(input: IProps) {
		const requests = await this.condominiumRequestFindByCondominiumId.exec({
			id: new UUID(input.condominiumId),
		});

		return requests;
	}
}
