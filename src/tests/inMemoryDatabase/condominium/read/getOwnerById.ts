import { CondominiumReadOps } from '@app/repositories/condominium/read';
import { TCondominiumInObject } from '@app/mapper/condominium';

export class InMemoryCondominiumGetByOwnerId
implements CondominiumReadOps.GetByOwnerId
{
	calls = {
		exec: 0,
	};

	async exec(): Promise<TCondominiumInObject[]> {
		++this.calls.exec;
		return [];
	}
}
