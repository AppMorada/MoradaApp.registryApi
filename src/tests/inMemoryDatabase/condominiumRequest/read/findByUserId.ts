import { CondominiumRequestReadOps } from '@app/repositories/condominiumRequest/read';

export class InMemoryCondominiumRequestFindByUserId
implements CondominiumRequestReadOps.FindByUserId
{
	calls = {
		exec: 0,
	};

	async exec() {
		++this.calls.exec;
		return undefined;
	}
}
