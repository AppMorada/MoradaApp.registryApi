import { UUID } from '@app/entities/VO';
import { CommunityMemberRepo } from '@app/repositories/communityMember';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class RemoveCommunityMemberService implements IService {
	constructor(private readonly memberRepo: CommunityMemberRepo) {}

	async exec(input: IProps) {
		await this.memberRepo.remove({ id: new UUID(input.id) });
	}
}
