import {
	EmployeeMemberReadOps,
	EmployeeMemberRepoReadOpsInterfaces,
} from '@app/repositories/employeeMember/read';

export class InMemoryEmployeeMembersGetGroupByCondominiumId
implements EmployeeMemberReadOps.GetGroupByCondominiumId
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<
		EmployeeMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[]
		> {
		++this.calls.exec;
		return [];
	}
}
