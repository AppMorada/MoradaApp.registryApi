import { Condominium } from '@app/entities/condominium';
import {
	CondominiumReadOpsInterfaces,
	CondominiumReadOps,
} from '@app/repositories/condominium/read';

export class InMemoryCondominiumGetByHumanReadableId
implements CondominiumReadOps.GetByHumanReadableId
{
	calls = {
		exec: 0,
	};

	async exec(
		input: CondominiumReadOpsInterfaces.getByHumanReadableId,
	): Promise<Condominium | undefined>;
	async exec(
		input: CondominiumReadOpsInterfaces.getByHumanReadableIdAsSafeSearch,
	): Promise<Condominium>;

	async exec(): Promise<Condominium | undefined> {
		++this.calls.exec;
		return undefined;
	}
}
