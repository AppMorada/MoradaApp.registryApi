import { ApartmentNumber, Block, Email, UUID } from '@app/entities/VO';
import { CommunityInfos } from '@app/entities/communityInfos';
import { CondominiumMember } from '@app/entities/condominiumMember';

export namespace CommunityMemberRepoWriteOpsInterfaces {
	export interface createMany {
		members: {
			content: CondominiumMember;
			communityInfos: CommunityInfos;
			rawUniqueRegistry: {
				email: Email;
			};
		}[];
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

	abstract remove(
		input: CommunityMemberRepoWriteOpsInterfaces.remove,
	): Promise<void>;
}
