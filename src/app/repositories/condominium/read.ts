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

export namespace CondominiumReadOps {
	export abstract class GetByHumanReadableId {
		abstract exec(
			input: CondominiumReadOpsInterfaces.getByHumanReadableIdAsSafeSearch,
		): Promise<Condominium>;
		abstract exec(
			input: CondominiumReadOpsInterfaces.getByHumanReadableId,
		): Promise<Condominium | undefined>;
	}

	export abstract class GetByOwnerId {
		abstract exec(
			input: CondominiumReadOpsInterfaces.getCondominiumsByOwnerId,
		): Promise<TCondominiumInObject[]>;
	}

	export abstract class Search {
		abstract exec(
			input: CondominiumReadOpsInterfaces.safeSearch,
		): Promise<Condominium>;

		abstract exec(
			input: CondominiumReadOpsInterfaces.search,
		): Promise<Condominium | undefined>;
	}
}
