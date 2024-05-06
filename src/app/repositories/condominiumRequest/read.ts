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

export namespace CondominiumRequestReadOps {
	export abstract class FindByUserId {
		abstract exec(
			input: CondominiumRequestRepoReadOpsInterfaces.search,
		): Promise<
			| CondominiumRequestRepoReadOpsInterfaces.findByUserIdResult
			| undefined
		>;
	}

	export abstract class FindByCondominiumId {
		abstract exec(
			input: CondominiumRequestRepoReadOpsInterfaces.search,
		): Promise<
			CondominiumRequestRepoReadOpsInterfaces.findByCondominiumIdResult[]
		>;
	}
}
