import {
	EmployeeMemberReadOps,
	EmployeeMemberRepoReadOpsInterfaces,
} from '@app/repositories/employeeMember/read';

export class InMemoryEmployeeMembersGetByUserId
implements EmployeeMemberReadOps.GetByUserId
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<
		EmployeeMemberRepoReadOpsInterfaces.getByUserIdReturn | undefined
		> {
		++this.calls.exec;
		return undefined;
	}
}
