import {
	CommunityMemberReadOps,
	CommunityMemberRepoReadOpsInterfaces,
} from '@app/repositories/communityMember/read';

export class InMemoryCommunityMembersGetGroupCondominiumId
implements CommunityMemberReadOps.GetByCondominiumId
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<
		CommunityMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[]
		> {
		++this.calls.exec;
		return [];
	}
}
