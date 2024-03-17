import { UUID } from '@app/entities/VO';
import { CommunityMemberRepo } from '@app/repositories/communityMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class GetCommunityMemberGroupByCondominiumIdService implements IService {
	constructor(private readonly memberRepo: CommunityMemberRepo) {}

	async exec(input: IProps) {
		const data = await this.memberRepo.getGroupCondominiumId({
			condominiumId: new UUID(input.id),
		});
		return data;
	}
}
