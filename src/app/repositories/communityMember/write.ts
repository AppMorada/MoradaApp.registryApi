import { ApartmentNumber, Block, CPF, Email, UUID } from '@app/entities/VO';
import { CommunityInfos } from '@app/entities/communityInfos';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { Invite } from '@app/entities/invite';

export namespace CommunityMemberRepoWriteOpsInterfaces {
	export interface createMany {
		members: {
			content: CondominiumMember;
			communityInfos: CommunityInfos;
			invite: Invite;
			rawUniqueRegistry: {
				email: Email;
				CPF: CPF;
			};
		}[];
	}

	export interface accept {
		userId: UUID;
	}

	export interface remove {
		id: UUID;
	}

	export interface update {
		id: UUID;
		apartmentNumber?: ApartmentNumber;
		block?: Block;
	}
}

export abstract class CommunityMemberWriteOpsRepo {
	abstract createMany(
		input: CommunityMemberRepoWriteOpsInterfaces.createMany,
	): Promise<void>;

	abstract update(
		input: CommunityMemberRepoWriteOpsInterfaces.update,
	): Promise<void>;

	abstract acceptRequest(
		input: CommunityMemberRepoWriteOpsInterfaces.accept,
	): Promise<void>;

	abstract remove(
		input: CommunityMemberRepoWriteOpsInterfaces.remove,
	): Promise<void>;
}
