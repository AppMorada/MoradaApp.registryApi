import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { CEP, Name, Num, UUID } from '@app/entities/VO';
import { CondominiumRepo } from '@app/repositories/condominium';

interface IProps {
	id: string;
	name?: string;
	CEP?: string;
	num?: number;
}

@Injectable()
export class UpdateCondominiumService implements IService {
	constructor(private readonly condominiumRepo: CondominiumRepo) {}

	async exec(input: IProps): Promise<void> {
		return await this.condominiumRepo.update({
			id: new UUID(input.id),
			name: input.name ? new Name(input.name) : undefined,
			CEP: input.CEP ? new CEP(input.CEP) : undefined,
			num: input.num ? new Num(input.num) : undefined,
		});
	}
}
