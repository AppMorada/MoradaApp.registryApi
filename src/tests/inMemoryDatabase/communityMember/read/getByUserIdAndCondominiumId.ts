import {
	CommunityMemberReadOps,
	CommunityMemberRepoReadOpsInterfaces,
} from '@app/repositories/communityMember/read';

export class InMemoryCommunityMembersGetByUserAndCondominiumId
implements CommunityMemberReadOps.GetByUserIdAndCondominiumId
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<
		| CommunityMemberRepoReadOpsInterfaces.getByUserIdAndCondominiumIdReturn
		| undefined
		> {
		++this.calls.exec;
		return undefined;
	}
}
