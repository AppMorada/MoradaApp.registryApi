import { UUID } from '@app/entities/VO';
import { CommunityMemberRepoReadOps } from '@app/repositories/communityMember/read';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetCommunityMemberGroupByCondominiumIdService implements IService {
	constructor(private readonly memberRepo: CommunityMemberRepoReadOps) {}

	async exec(input: IProps) {
		const data = await this.memberRepo.getGroupCondominiumId({
			condominiumId: new UUID(input.id),
		});
		return data;
	}
}
