import { UUID } from '@app/entities/VO';
import { CommunityInfos } from '@app/entities/communityInfos';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';
import { TReplace } from '@utils/replace';

export namespace CommunityMemberRepoReadOpsInterfaces {
	export interface performantCondominiumMember {
		id: string;
		condominiumId: string;
		userId?: string | null;
		uniqueRegistryId?: undefined;
		role: number;
		createdAt: Date;
		updatedAt: Date;
	}

	export interface performantCommunityInfos {
		memberId?: undefined;
		aparmentNumber?: number | null;
		block?: string | null;
		updatedAt: Date;
	}

	export interface getByCondominiumId {
		condominiumId: UUID;
	}

	export interface getByCondominiumIdReturn {
		member: performantCondominiumMember;
		communityInfos: performantCommunityInfos;
		uniqueRegistry: IUniqueRegistryInObject;
	}

	export interface getByUserId {
		id: UUID;
	}

	export interface getByUserIdReturn {
		member: TReplace<performantCondominiumMember, { userId?: undefined }>;
		communityInfos: performantCommunityInfos;
	}

	export interface getByUserIdAndCondominiumIdReturn {
		member: CondominiumMember;
		communityInfos: CommunityInfos;
	}

	export interface getById {
		id: UUID;
	}

	export interface getByIdReturn {
		member: performantCondominiumMember;
		communityInfos: performantCommunityInfos;
		uniqueRegistry: IUniqueRegistryInObject;
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

	abstract getByUserAndCondominiumId(
		input: CommunityMemberRepoReadOpsInterfaces.getByUserIdAndCondominiumId,
	): Promise<
		| CommunityMemberRepoReadOpsInterfaces.getByUserIdAndCondominiumIdReturn
		| undefined
	>;
}
