import { UserWriteOps } from '@app/repositories/user/write';

export class InMemoryUserUpdate implements UserWriteOps.Update {
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
