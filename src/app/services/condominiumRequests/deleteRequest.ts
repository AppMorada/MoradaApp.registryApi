import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { CondominiumRequestRepoWriteOps } from '@app/repositories/condominiumRequest/write';
import { UUID } from '@app/entities/VO';

interface IProps {
	userId: string;
	condominiumId: string;
}

@Injectable()
export class DeleteCondominiumRequestService implements IService {
	constructor(
		private readonly condominiumRequest: CondominiumRequestRepoWriteOps,
	) {}

	async exec(input: IProps) {
		await this.condominiumRequest.removeByUserIdAndCondominiumId({
			condominiumId: new UUID(input.condominiumId),
			userId: new UUID(input.userId),
		});
	}
}
