import { CondominiumRequestWriteOps } from '@app/repositories/condominiumRequest/write';

export class InMemoryCondominiumRequestAcceptRequest
implements CondominiumRequestWriteOps.AcceptRequest
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<void> {
		++this.calls.exec;
	}
}
