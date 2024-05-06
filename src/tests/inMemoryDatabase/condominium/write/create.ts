import { CondominiumWriteOps } from '@app/repositories/condominium/write';

export class InMemoryCondominiumCreate implements CondominiumWriteOps.Create {
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
