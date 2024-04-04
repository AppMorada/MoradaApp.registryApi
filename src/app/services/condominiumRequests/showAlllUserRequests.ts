import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumRequestRepoReadOps } from '@app/repositories/condominiumRequest/read';

interface IProps {
	userId: string;
}

@Injectable()
export class ShowAllUserCondominiumRequestsService implements IService {
	constructor(
		private readonly condominiumRequest: CondominiumRequestRepoReadOps,
	) {}

	async exec(input: IProps) {
		const result = await this.condominiumRequest.findByUserId({
			id: new UUID(input.userId),
		});

		return {
			requestCollection: result,
		};
	}
}
