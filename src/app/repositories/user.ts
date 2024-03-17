import { UUID, Name, PhoneNumber, Email } from '@app/entities/VO';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { User } from '@app/entities/user';

export namespace UserRepoInterfaces {
	export interface search {
		safeSearch?: undefined;
		key: UUID | Email;
	}
	export interface safeSearch {
		safeSearch?: true;
		key: UUID | Email;
	}
	export interface searchReturnableData {
		user: User;
		uniqueRegistry: UniqueRegistry;
	}
	export interface remove {
		key: UUID;
	}
	export interface update {
		id: UUID;
		name?: Name;
		phoneNumber?: PhoneNumber;
	}
}

export abstract class UserRepo {
	abstract find(
		input: UserRepoInterfaces.search,
	): Promise<UserRepoInterfaces.searchReturnableData | undefined>;

	abstract find(
		input: UserRepoInterfaces.safeSearch,
	): Promise<UserRepoInterfaces.searchReturnableData>;

	abstract delete(input: UserRepoInterfaces.remove): Promise<void>;

	abstract update(input: UserRepoInterfaces.update): Promise<void>;
}
