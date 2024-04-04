import { UUID } from '@app/entities/VO';
import { TCondominiumRequestInObject } from '@app/mapper/condominiumRequest';

export namespace CondominiumRequestRepoReadOpsInterfaces {
	export interface search {
		id: UUID;
	}

	export interface findByUserIdResult {
		requests: TCondominiumRequestInObject[];
		email: string;
		name: string;
	}

	export interface findByCondominiumIdResult {
		request: TCondominiumRequestInObject;
		email: string;
		name: string;
	}
}

export abstract class CondominiumRequestRepoReadOps {
	abstract findByUserId(
		input: CondominiumRequestRepoReadOpsInterfaces.search,
	): Promise<
		CondominiumRequestRepoReadOpsInterfaces.findByUserIdResult | undefined
	>;
	abstract findByCondominiumId(
		input: CondominiumRequestRepoReadOpsInterfaces.search,
	): Promise<
		CondominiumRequestRepoReadOpsInterfaces.findByCondominiumIdResult[]
	>;
}
