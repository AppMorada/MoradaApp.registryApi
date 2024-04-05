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

export abstract class CondominiumRequestRepoWriteOps {
	abstract acceptRequest(
		input: CondominiumRequestRepoWriteOpsInterfaces.accept,
	): Promise<void>;
	abstract create(
		input: CondominiumRequestRepoWriteOpsInterfaces.create,
	): Promise<void>;
	abstract removeByUserIdAndCondominiumId(
		input: CondominiumRequestRepoWriteOpsInterfaces.remove,
	): Promise<void>;
}
