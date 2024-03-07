import { CEP, CNPJ, UUID, Name, Num } from '@app/entities/VO';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import { TCondominiumInObject } from '@app/mapper/condominium';

export namespace CondominiumInterfaces {
	export interface create {
		user: User;
		condominium: Condominium;
	}

	export interface safeSearch {
		safeSearch?: true;
		key: UUID | CNPJ | CEP | Name;
	}
	export interface search {
		safeSearch: undefined;
		key: UUID | CNPJ | CEP | Name;
	}

	export interface getCondominiumsByOwnerId {
		id: UUID;
	}

	export interface update {
		id: UUID;
		name?: Name;
		CEP?: CEP;
		num?: Num;
	}

	export interface remove {
		id: UUID;
	}
}

export abstract class CondominiumRepo {
	abstract create(input: CondominiumInterfaces.create): Promise<void>;

	abstract update(input: CondominiumInterfaces.update): Promise<void>;

	abstract remove(input: CondominiumInterfaces.remove): Promise<void>;

	abstract find(
		input: CondominiumInterfaces.safeSearch,
	): Promise<Condominium>;

	abstract find(
		input: CondominiumInterfaces.search,
	): Promise<Condominium | undefined>;

	abstract getCondominiumsByOwnerId(
		input: CondominiumInterfaces.getCondominiumsByOwnerId,
	): Promise<Required<TCondominiumInObject>[]>;
}
