import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumRepo } from '@app/repositories/condominium';
import {
	CondominiumMapper,
	TCondominiumInObject,
} from '@app/mapper/condominium';

interface IProps {
	id: UUID;
}

@Injectable()
export class GetCondominiumService implements IService {
	constructor(private readonly condominiumRepo: CondominiumRepo) {}

	async exec(input: IProps) {
		const raw = await this.condominiumRepo.find({ key: input.id });

		let condominium: TCondominiumInObject | undefined;
		if (raw) condominium = CondominiumMapper.toObject(raw);

		return { data: condominium ?? null };
	}
}
