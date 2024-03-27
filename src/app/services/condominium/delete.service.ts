import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumRepoWriteOps } from '@app/repositories/condominium/write';

interface IProps {
	id: UUID;
}

@Injectable()
export class DeleteCondominiumService implements IService {
	constructor(private readonly condominiumRepo: CondominiumRepoWriteOps) {}

	async exec(input: IProps): Promise<void> {
		return await this.condominiumRepo.remove(input);
	}
}
