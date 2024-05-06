import { EmployeeMemberWriteOps } from '@app/repositories/employeeMember/write';

export class InMemoryEmployeeMembersCreate
implements EmployeeMemberWriteOps.Create
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
