import { UUID } from '@app/entities/VO';
import { CondominiumRequest } from '@app/entities/condominiumRequest';
import { TCondominiumRequestInObject } from '@app/mapper/condominiumRequest';

export namespace CondominiumRequestRepoReadOpsInterfaces {
	export interface search {
		id: UUID;
	}
}

export abstract class CondominiumRequestRepoReadOps {
	abstract findByUserId(
		input: CondominiumRequestRepoReadOpsInterfaces.search,
	): Promise<CondominiumRequest | undefined>;
	abstract findByCondominiumId(
		input: CondominiumRequestRepoReadOpsInterfaces.search,
	): Promise<TCondominiumRequestInObject[]>;
}
