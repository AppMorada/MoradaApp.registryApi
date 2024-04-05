import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import {
	CEP,
	City,
	Complement,
	District,
	Name,
	Num,
	Reference,
	State,
	UUID,
} from '@app/entities/VO';
import { CondominiumRepoWriteOps } from '@app/repositories/condominium/write';

interface IProps {
	id: string;
	name?: string;
	CEP?: string;
	district?: string;
	city?: string;
	state?: string;
	reference?: string;
	complement?: string;
	num?: number;
}

@Injectable()
export class UpdateCondominiumService implements IService {
	constructor(private readonly condominiumRepo: CondominiumRepoWriteOps) {}

	async exec(input: IProps): Promise<void> {
		return await this.condominiumRepo.update({
			id: new UUID(input.id),
			name: input.name ? new Name(input.name) : undefined,
			CEP: input.CEP ? new CEP(input.CEP) : undefined,
			num: input.num ? new Num(input.num) : undefined,
			district: input.district ? new District(input.district) : undefined,
			city: input.city ? new City(input.city) : undefined,
			state: input.state ? new State(input.state) : undefined,
			reference: input.reference
				? new Reference(input.reference)
				: undefined,
			complement: input.complement
				? new Complement(input.complement)
				: undefined,
		});
	}
}
