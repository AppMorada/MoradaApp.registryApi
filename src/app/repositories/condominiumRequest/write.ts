import { UUID } from '@app/entities/VO';
import { Condominium } from '@app/entities/condominium';
import { CondominiumRequest } from '@app/entities/condominiumRequest';

export namespace CondominiumRequestRepoWriteOpsInterfaces {
	export interface remove {
		userId: UUID;
		condominiumId: UUID;
	}
	export interface create {
		request: CondominiumRequest;
		condominium: Condominium;
	}
	export interface accept {
		userId: UUID;
		condominiumId: UUID;
	}
}

export namespace CondominiumRequestWriteOps {
	export abstract class AcceptRequest {
		abstract exec(
			input: CondominiumRequestRepoWriteOpsInterfaces.accept,
		): Promise<void>;
	}

	export abstract class Create {
		abstract exec(
			input: CondominiumRequestRepoWriteOpsInterfaces.create,
		): Promise<void>;
	}

	export abstract class RemoveByUserIdAndCondominiumId {
		abstract exec(
			input: CondominiumRequestRepoWriteOpsInterfaces.remove,
		): Promise<void>;
	}
}
