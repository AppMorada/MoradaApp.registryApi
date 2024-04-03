import { UUID } from '@app/entities/VO';
import { CommunityInfos } from '@app/entities/communityInfos';
import { Condominium } from '@app/entities/condominium';
import { CondominiumMember } from '@app/entities/condominiumMember';
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
		condominiumMember: CondominiumMember;
		communityInfo: CommunityInfos;
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
