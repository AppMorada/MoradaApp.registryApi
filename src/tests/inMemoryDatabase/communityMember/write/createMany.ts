import { CommunityMemberWriteOps } from '@app/repositories/communityMember/write';

export class InMemoryCommunityMembersCreateMany
implements CommunityMemberWriteOps.CreateMany
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
