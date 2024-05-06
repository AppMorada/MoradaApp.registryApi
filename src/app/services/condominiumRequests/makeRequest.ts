import { Injectable } from '@nestjs/common';
import { IService } from '../_IService';
import { CondominiumRequestWriteOps } from '@app/repositories/condominiumRequest/write';
import { CondominiumRequest } from '@app/entities/condominiumRequest';
import { CondominiumReadOps } from '@app/repositories/condominium/read';

interface IProps {
	userId: string;
	uniqueRegistryId: string;
	condominiumHumanReadableId: string;
	message?: string;
}

@Injectable()
export class MakeCondominiumRequestService implements IService {
	constructor(
		private readonly condominiumRequestRepoCreate: CondominiumRequestWriteOps.Create,
		private readonly condominiumRepoGetByHumanReadableId: CondominiumReadOps.GetByHumanReadableId,
	) {}

	async exec(input: IProps) {
		const condominium = await this.condominiumRepoGetByHumanReadableId.exec(
			{
				id: input.condominiumHumanReadableId,
				safeSearch: true,
			},
		);
		const request = new CondominiumRequest({
			userId: input.userId,
			uniqueRegistryId: input.uniqueRegistryId,
			message: input.message,
			condominiumId: condominium.id.value,
		});

		await this.condominiumRequestRepoCreate.exec({ request, condominium });
	}
}
