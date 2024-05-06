import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumRequestReadOps } from '@app/repositories/condominiumRequest/read';

interface IProps {
	userId: string;
}

@Injectable()
export class ShowAllUserCondominiumRequestsService implements IService {
	constructor(
		private readonly condominiumRequestFindByUserId: CondominiumRequestReadOps.FindByUserId,
	) {}

	async exec(input: IProps) {
		const result = await this.condominiumRequestFindByUserId.exec({
			id: new UUID(input.userId),
		});

		return {
			requestCollection: result,
		};
	}
}
