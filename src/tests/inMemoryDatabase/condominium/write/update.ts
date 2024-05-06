import { CondominiumWriteOps } from '@app/repositories/condominium/write';

export class InMemoryCondominiumUpdate implements CondominiumWriteOps.Update {
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
