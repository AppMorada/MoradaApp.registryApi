import { CondominiumRequestWriteOps } from '@app/repositories/condominiumRequest/write';

export class InMemoryCondominiumRequestRemove
implements CondominiumRequestWriteOps.RemoveByUserIdAndCondominiumId
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
