import { UUID } from '@app/entities/VO';
import { CommunityMemberRepoReadOps } from '@app/repositories/communityMember/read';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetCommunityMemberByUserIdService implements IService {
	constructor(private readonly memberRepo: CommunityMemberRepoReadOps) {}

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
