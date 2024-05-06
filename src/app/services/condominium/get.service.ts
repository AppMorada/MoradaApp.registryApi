import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { UUID } from '@app/entities/VO';
import { CondominiumReadOps } from '@app/repositories/condominium/read';
import {
	CondominiumMapper,
	TCondominiumInObject,
} from '@app/mapper/condominium';

interface IProps {
	id: UUID;
}

@Injectable()
export class GetCondominiumService implements IService {
	constructor(
		private readonly condominiumRepoSearch: CondominiumReadOps.Search,
	) {}

	async exec(input: IProps) {
		const raw = await this.condominiumRepoSearch.exec({ key: input.id });

		let condominium: Omit<TCondominiumInObject, 'seedKey'> | undefined;
		if (raw) {
			const objt = CondominiumMapper.toObject(raw) as any;
			delete objt.seedKey;

			condominium = objt;
		}

		return { data: condominium ?? null };
	}
}
