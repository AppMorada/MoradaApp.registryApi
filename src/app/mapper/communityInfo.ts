import { CommunityInfos } from '@app/entities/communityInfos';

interface ICommunityInfoToObject {
	memberId: string;
	apartmentNumber?: number | null;
	block?: string | null;
	updatedAt?: Date;
}

export interface ICommunityInfoAsObject {
	memberId: string;
	apartmentNumber?: number | null;
	block?: string | null;
	updatedAt: Date;
}

export class CommunityInfoMapper {
	static toClass({ ...rest }: ICommunityInfoToObject): CommunityInfos {
		return new CommunityInfos({ ...rest });
	}

	static toObject(input: CommunityInfos): ICommunityInfoAsObject {
		return {
			memberId: input.memberId.value,
			apartmentNumber: input.apartmentNumber
				? input.apartmentNumber.value
				: input.apartmentNumber,
			block: input.block ? input.block.value : input.block,
			updatedAt: input.updatedAt,
		};
	}
}
