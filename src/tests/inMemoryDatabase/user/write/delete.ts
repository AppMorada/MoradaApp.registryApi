import { UserWriteOps } from '@app/repositories/user/write';

export class InMemoryUserDelete implements UserWriteOps.Delete {
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
