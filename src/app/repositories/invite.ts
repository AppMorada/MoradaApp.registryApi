import { UUID, Email, CPF } from '@app/entities/VO';
import { Invite } from '@app/entities/invite';
import { User } from '@app/entities/user';

export namespace InviteRepoInterfaces {
	export interface create {
		invite: Invite;
	}
	export interface find {
		key: Email | CPF;
		safeSearch: undefined;
	}
	export interface safelyFind {
		key: Email | CPF;
		safeSearch?: true;
	}
	export interface remove {
		key: UUID;
	}
	export interface transferToUserResources {
		user: User;
		condominiumId: UUID;
	}
}

export abstract class InviteRepo {
	/** @virtual */
	abstract create(input: InviteRepoInterfaces.create): Promise<void>;

	/**
	 * @virtual
	 * Método usado para pesquisar por um convite
	 * @param input - Deve conter uma chave a ser utilizada para a pesquisa, deve ser uma classe email. Além disso, pode-se usar como valor opcional o safeSearch, que força um erro, caso o item não seja encontrado
	 **/
	abstract find(
		input: InviteRepoInterfaces.find,
	): Promise<Invite | undefined>;

	/**
	 * @virtual
	 * Método usado para pesquisar por um convite
	 * @param input - Deve conter uma chave a ser utilizada para a pesquisa, pode ser um id, cnpj, cep ou o nome do condomínio. Além disso, pode-se usar como valor opcional o safeSearch, que força um erro, caso o item não seja encontrado
	 **/
	abstract find(input: InviteRepoInterfaces.safelyFind): Promise<Invite>;

	/**
	 * @virtual
	 * Método usado para transferir um convite para os recursos de usuários
	 **/
	abstract transferToUserResources(
		input: InviteRepoInterfaces.transferToUserResources,
	): Promise<void>;

	/** @virtual */
	abstract delete(input: InviteRepoInterfaces.remove): Promise<void>;
}
