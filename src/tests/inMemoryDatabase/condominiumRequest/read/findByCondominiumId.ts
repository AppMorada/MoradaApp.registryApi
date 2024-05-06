import { CondominiumRequestReadOps } from '@app/repositories/condominiumRequest/read';

export class InMemoryCondominiumRequestFindByCondominiumId
implements CondominiumRequestReadOps.FindByCondominiumId
{
	calls = {
		exec: 0,
	};

	async exec() {
		++this.calls.exec;
		return [];
	}
}
