import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { CondominiumRequestWriteOps } from '@app/repositories/condominiumRequest/write';
import { UUID } from '@app/entities/VO';

interface IProps {
	userId: string;
	condominiumId: string;
}

@Injectable()
export class DeleteCondominiumRequestService implements IService {
	constructor(
		private readonly condominiumRequestRemove: CondominiumRequestWriteOps.RemoveByUserIdAndCondominiumId,
	) {}

	async exec(input: IProps) {
		await this.condominiumRequestRemove.exec({
			condominiumId: new UUID(input.condominiumId),
			userId: new UUID(input.userId),
		});
	}
}
