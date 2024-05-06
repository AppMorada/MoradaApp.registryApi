import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumWriteOps } from '@app/repositories/condominium/write';

interface IProps {
	id: UUID;
}

@Injectable()
export class DeleteCondominiumService implements IService {
	constructor(
		private readonly condominiumRepoRemove: CondominiumWriteOps.Remove,
	) {}

	async exec(input: IProps): Promise<void> {
		return await this.condominiumRepoRemove.exec(input);
	}
}
