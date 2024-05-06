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

export namespace CommunityMemberWriteOps {
	export abstract class CreateMany {
		abstract exec(
			input: CommunityMemberRepoWriteOpsInterfaces.createMany,
		): Promise<void>;
	}

	export abstract class Update {
		abstract exec(
			input: CommunityMemberRepoWriteOpsInterfaces.update,
		): Promise<void>;
	}

	export abstract class Remove {
		abstract exec(
			input: CommunityMemberRepoWriteOpsInterfaces.remove,
		): Promise<void>;
	}
}
