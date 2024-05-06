import { CommunityMemberWriteOps } from '@app/repositories/communityMember/write';

export class InMemoryCommunityMembersRemove
implements CommunityMemberWriteOps.Remove
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
