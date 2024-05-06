import { Condominium } from '@app/entities/condominium';
import {
	CondominiumReadOps,
	CondominiumReadOpsInterfaces,
} from '@app/repositories/condominium/read';

export class InMemoryCondominiumSearch implements CondominiumReadOps.Search {
	calls = {
		exec: 0,
	};

	async exec(
		input: CondominiumReadOpsInterfaces.safeSearch,
	): Promise<Condominium>;
	async exec(
		input: CondominiumReadOpsInterfaces.search,
	): Promise<Condominium | undefined>;

	async exec(): Promise<Condominium | undefined> {
		++this.calls.exec;
		return undefined;
	}
}
