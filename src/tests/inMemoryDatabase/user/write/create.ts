import {
	UserWriteOps,
	UserRepoWriteOpsInterfaces,
} from '@app/repositories/user/write';

export class InMemoryUserCreate implements UserWriteOps.Create {
	calls = {
		exec: 0,
	};

	async exec(): Promise<UserRepoWriteOpsInterfaces.createReturn> {
		++this.calls.exec;
		return {
			affectedCondominiumMembers: 0,
		};
	}
}
