import {
	CommunityMemberReadOps,
	CommunityMemberRepoReadOpsInterfaces,
} from '@app/repositories/communityMember/read';

export class InMemoryCommunityMembersGetById
implements CommunityMemberReadOps.GetById
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<
		CommunityMemberRepoReadOpsInterfaces.getByIdReturn | undefined
		> {
		++this.calls.exec;
		return undefined;
	}
}
