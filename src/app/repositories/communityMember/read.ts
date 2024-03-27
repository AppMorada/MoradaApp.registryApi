import { UUID } from '@app/entities/VO';
import { CommunityInfos } from '@app/entities/communityInfos';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { ICommunityInfoAsObject } from '@app/mapper/communityInfo';
import { ICondominiumMemberInObject } from '@app/mapper/condominiumMember';
import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';

export namespace CommunityMemberRepoReadOpsInterfaces {
	export interface getByCondominiumId {
		condominiumId: UUID;
	}

	export interface getByCondominiumIdReturn {
		member: ICondominiumMemberInObject;
		communityInfos: ICommunityInfoAsObject;
		uniqueRegistry: IUniqueRegistryInObject;
	}

	export interface getByUserId {
		id: UUID;
	}

	export interface getByUserIdReturn {
		member: ICondominiumMemberInObject;
		communityInfos: ICommunityInfoAsObject;
	}

	export interface getById {
		id: UUID;
	}

	export interface getByIdReturn {
		member: CondominiumMember;
		communityInfos: CommunityInfos;
		uniqueRegistry: UniqueRegistry;
	}

	export interface getByUserIdAndCondominiumId {
		userId: UUID;
		condominiumId: UUID;
	}
}

export abstract class CommunityMemberRepoReadOps {
	abstract getByUserId(
		input: CommunityMemberRepoReadOpsInterfaces.getByUserId,
	): Promise<CommunityMemberRepoReadOpsInterfaces.getByUserIdReturn[]>;

	abstract getById(
		input: CommunityMemberRepoReadOpsInterfaces.getById,
	): Promise<CommunityMemberRepoReadOpsInterfaces.getByIdReturn | undefined>;

	abstract getGroupCondominiumId(
		input: CommunityMemberRepoReadOpsInterfaces.getByCondominiumId,
	): Promise<CommunityMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[]>;

	abstract checkByUserAndCondominiumId(
		input: CommunityMemberRepoReadOpsInterfaces.getByUserIdAndCondominiumId,
	): Promise<number>;
}
