import { CEP, CNPJ, UUID, Name } from '@app/entities/VO';
import { Condominium } from '@app/entities/condominium';

export namespace CondominiumInterfaces {
	export interface create {
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
}

export abstract class CondominiumRepo {
	/** @virtual */
	abstract create: (input: CondominiumInterfaces.create) => Promise<void>;

	/**
	 * @virtual
	 * Método usado para pesquisar por um condomínio
	 * @param input - Deve conter chave a ser utilizada para a pesquisa, pode ser um id, cnpj, cep ou o nome do condomínio. Além disso, pode-se usar como valor opcional o safeSearch, que força um erro, caso o item não seja encontrado
	 **/
	abstract find(
		input: CondominiumInterfaces.safeSearch,
	): Promise<Condominium>;

	/**
	 * @virtual
	 * Método usado para pesquisar por um condomínio
	 * @param input - Deve conter chave a ser utilizada para a pesquisa, pode ser um id, cnpj, cep ou o nome do condomínio. Além disso, pode-se usar como valor opcional o safeSearch, que força um erro, caso o item não seja encontrado
	 **/
	abstract find(
		input: CondominiumInterfaces.search,
	): Promise<Condominium | undefined>;
}
