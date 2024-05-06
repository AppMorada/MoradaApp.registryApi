import { UUID } from '@app/entities/VO';
import { CommunityMemberReadOps } from '@app/repositories/communityMember/read';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetCommunityMemberByUserIdService implements IService {
	constructor(
		private readonly memberRepoGetByUserId: CommunityMemberReadOps.GetByUserId,
	) {}

	async exec(input: IProps) {
		const searchedMember = await this.memberRepoGetByUserId.exec({
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
