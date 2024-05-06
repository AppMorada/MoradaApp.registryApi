import { EmployeeMemberWriteOps } from '@app/repositories/employeeMember/write';

export class InMemoryEmployeeMembersUpdate
implements EmployeeMemberWriteOps.Update
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
