import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumRepo } from '@app/repositories/condominium';

interface IProps {
	id: UUID;
}

@Injectable()
export class DeleteCondominiumService implements IService {
	constructor(private readonly condominiumRepo: CondominiumRepo) {}

	async exec(input: IProps): Promise<void> {
		return await this.condominiumRepo.remove(input);
	}
}
