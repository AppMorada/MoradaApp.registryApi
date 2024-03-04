import { CPF, UUID, Email, Name, PhoneNumber } from '@app/entities/VO';
import { User } from '@app/entities/user';

export namespace UserRepoInterfaces {
	export interface search {
		safeSearch?: undefined;
		key: Email | CPF | UUID;
	}
	export interface safeSearch {
		safeSearch?: true;
		key: Email | CPF | UUID;
	}
	export interface remove {
		key: UUID;
	}
	export interface update {
		id: UUID;
		name?: Name;
		CPF?: CPF;
		phoneNumber?: PhoneNumber;
	}
}

export abstract class UserRepo {
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
	abstract delete(input: UserRepoInterfaces.remove): Promise<void>;

	/** @virtual */
	abstract update(input: UserRepoInterfaces.update): Promise<void>;
}
