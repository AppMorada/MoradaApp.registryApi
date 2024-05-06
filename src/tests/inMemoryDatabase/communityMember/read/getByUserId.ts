import {
	CommunityMemberReadOps,
	CommunityMemberRepoReadOpsInterfaces,
} from '@app/repositories/communityMember/read';

export class InMemoryCommunityMembersGetByUserId
implements CommunityMemberReadOps.GetByUserId
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<
		CommunityMemberRepoReadOpsInterfaces.getByUserIdReturn[]
		> {
		++this.calls.exec;
		return [];
	}
}
