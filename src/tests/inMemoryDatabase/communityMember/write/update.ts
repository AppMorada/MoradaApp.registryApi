import { CommunityMemberWriteOps } from '@app/repositories/communityMember/write';

export class InMemoryCommunityMembersUpdate
implements CommunityMemberWriteOps.Update
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
