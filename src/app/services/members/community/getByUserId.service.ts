import { UUID } from '@app/entities/VO';
import { CommunityMemberRepo } from '@app/repositories/communityMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetCommunityMemberByUserIdService implements IService {
	constructor(private readonly memberRepo: CommunityMemberRepo) {}

	async exec(input: IProps) {
		const searchedMember = await this.memberRepo.getByUserId({
			id: new UUID(input.id),
		});

		const data = searchedMember.map((item) => {
			const member = item.member;
			delete member.userId;

			const communityInfo = item.communityInfos;
			return { memberCoreInfo: member, communityInfo };
		});

		return {
			communityInfos: data,
		};
	}
}
