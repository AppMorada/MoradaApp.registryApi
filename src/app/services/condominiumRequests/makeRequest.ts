import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { CondominiumRequestRepoWriteOps } from '@app/repositories/condominiumRequest/write';
import { CondominiumRequest } from '@app/entities/condominiumRequest';
import { CondominiumRepoReadOps } from '@app/repositories/condominium/read';

interface IProps {
	userId: string;
	uniqueRegistryId: string;
	condominiumHumanReadableId: string;
	message?: string;
}

@Injectable()
export class MakeCondominiumRequestService implements IService {
	constructor(
		private readonly condominiumRequestRepo: CondominiumRequestRepoWriteOps,
		private readonly condominiumRepo: CondominiumRepoReadOps,
	) {}

	async exec(input: IProps) {
		const condominium = await this.condominiumRepo.getByHumanReadableId({
			id: input.condominiumHumanReadableId,
			safeSearch: true,
		});
		const request = new CondominiumRequest({
			userId: input.userId,
			uniqueRegistryId: input.uniqueRegistryId,
			message: input.message,
			condominiumId: condominium.id.value,
		});

		await this.condominiumRequestRepo.create({ request, condominium });
	}
}
