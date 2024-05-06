import { CondominiumWriteOps } from '@app/repositories/condominium/write';

export class InMemoryCondominiumRemove implements CondominiumWriteOps.Remove {
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
