import { CEP, CNPJ, UUID, Name } from '@app/entities/VO';
import { Condominium } from '@app/entities/condominium';
import { TCondominiumInObject } from '@app/mapper/condominium';

export namespace CondominiumReadOpsInterfaces {
	export interface safeSearch {
		safeSearch?: true;
		key: UUID | CNPJ | CEP | Name;
	}
	export interface search {
		safeSearch: undefined;
		key: UUID | CNPJ | CEP | Name;
	}

	export interface getByHumanReadableIdAsSafeSearch {
		safeSearch?: true;
		id: string;
	}

	export interface getByHumanReadableId {
		safeSearch: undefined;
		id: string;
	}

	export interface getCondominiumsByOwnerId {
		id: UUID;
	}
}

export abstract class CondominiumRepoReadOps {
	abstract find(
		input: CondominiumReadOpsInterfaces.safeSearch,
	): Promise<Condominium>;

	abstract find(
		input: CondominiumReadOpsInterfaces.search,
	): Promise<Condominium | undefined>;

	abstract getByHumanReadableId(
		input: CondominiumReadOpsInterfaces.getByHumanReadableIdAsSafeSearch,
	): Promise<Condominium>;
	abstract getByHumanReadableId(
		input: CondominiumReadOpsInterfaces.getByHumanReadableId,
	): Promise<Condominium | undefined>;

	abstract getCondominiumsByOwnerId(
		input: CondominiumReadOpsInterfaces.getCondominiumsByOwnerId,
	): Promise<Required<TCondominiumInObject>[]>;
}
