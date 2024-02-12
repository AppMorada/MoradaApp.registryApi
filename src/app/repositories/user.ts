import { CPF, UUID, Email } from '@app/entities/VO';
import { CondominiumRelUser } from '@app/entities/condominiumRelUser';
import { User } from '@app/entities/user';
import { TCondominiumRelUserToObject } from '@app/mapper/condominiumRelUser';

export namespace UserRepoInterfaces {
	export interface create {
		user: User;
		condominiumRelUser: CondominiumRelUser;
	}
	export interface search {
		safeSearch?: undefined;
		key: Email | CPF | UUID;
	}
	export interface safeSearch {
		safeSearch?: true;
		key: Email | CPF | UUID;
	}
	export interface getCondominiumRelation {
		userId: UUID;
		condominiumId: UUID;
	}
	export interface getAllCondominiumRelation {
		userId: UUID;
	}
	export interface remove {
		key: UUID | Email;
	}
}

export abstract class UserRepo {
	/** @virtual */
	abstract create(input: UserRepoInterfaces.create): Promise<void>;

	/**
	 * @virtual
	 * Método usado para pesquisar por um usuário
	 * @param input - Deve conter chave a ser utilizada para a pesquisa, pode ser um id, email ou o email do usuário. Além disso, pode-se usar como valor opcional o safeSearch, que força um erro, caso o item não seja encontrado
	 **/
	abstract find(input: UserRepoInterfaces.search): Promise<User | undefined>;

	/**
	 * @virtual
	 * Método usado para pesquisar por um usuário
	 * @param input.key - Deve conter uma chave a ser utilizada para a pesquisa, pode ser um id, email ou o email do usuário. Além disso, pode-se usar como valor opcional o safeSearch, que força um erro, caso o item não seja encontrado
	 **/
	abstract find(input: UserRepoInterfaces.safeSearch): Promise<User>;

	/** @virtual */
	abstract getCondominiumRelation(
		input: UserRepoInterfaces.getCondominiumRelation,
	): Promise<CondominiumRelUser | undefined>;

	/** @virtual */
	abstract getAllCondominiumRelation(
		input: UserRepoInterfaces.getAllCondominiumRelation,
	): Promise<TCondominiumRelUserToObject[]>;

	/** @virtual */
	abstract delete(input: UserRepoInterfaces.remove): Promise<void>;
}
