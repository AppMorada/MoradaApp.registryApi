import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { CondominiumRequestWriteOps } from '@app/repositories/condominiumRequest/write';
import { UUID } from '@app/entities/VO';

interface IProps {
	userId: string;
	condominiumId: string;
}

@Injectable()
export class AcceptCondominiumRequestService implements IService {
	constructor(
		private readonly condominiumRequestAccept: CondominiumRequestWriteOps.AcceptRequest,
	) {}

	async exec(input: IProps) {
		await this.condominiumRequestAccept.exec({
			userId: new UUID(input.userId),
			condominiumId: new UUID(input.condominiumId),
		});
	}
}
