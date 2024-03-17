import { CommunityInfos } from '@app/entities/communityInfos';

export interface ICommunityInfoAsObject {
	memberId: string;
	apartmentNumber: number;
	block: string;
	updatedAt?: Date;
}

export class CommunityInfoMapper {
	static toClass({ ...rest }: ICommunityInfoAsObject): CommunityInfos {
		return new CommunityInfos({ ...rest });
	}

	static toObject(input: CommunityInfos): ICommunityInfoAsObject {
		return {
			memberId: input.memberId.value,
			apartmentNumber: input.apartmentNumber.value,
			block: input.block.value,
			updatedAt: input.updatedAt,
		};
	}
}
