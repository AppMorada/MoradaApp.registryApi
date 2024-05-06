import { UUID } from '@app/entities/VO';
import { CommunityMemberWriteOps } from '@app/repositories/communityMember/write';
import { IService } from '@app/services/_IService';
import { Injectable } from '@nestjs/common';

interface IProps {
	id: string;
}

@Injectable()
export class RemoveCommunityMemberService implements IService {
	constructor(
		private readonly memberRepoRemove: CommunityMemberWriteOps.Remove,
	) {}

	async exec(input: IProps) {
		await this.memberRepoRemove.exec({ id: new UUID(input.id) });
	}
}
