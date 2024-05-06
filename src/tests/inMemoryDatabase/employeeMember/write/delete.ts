import { EmployeeMemberWriteOps } from '@app/repositories/employeeMember/write';

export class InMemoryEmployeeMembersRemove
implements EmployeeMemberWriteOps.Remove
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
