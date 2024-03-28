import { UUID } from '@app/entities/VO';
import { CondominiumRequest } from '@app/entities/condominiumRequest';

export namespace CondominiumRequestRepoWriteOpsInterfaces {
	export interface remove {
		id: UUID;
	}
	export interface create {
		request: CondominiumRequest;
	}
}

export abstract class CondominiumRequestRepoWriteOps {
	abstract create(
		input: CondominiumRequestRepoWriteOpsInterfaces.create,
	): Promise<void>;
	abstract removeByUserId(
		input: CondominiumRequestRepoWriteOpsInterfaces.remove,
	): Promise<void>;
}
