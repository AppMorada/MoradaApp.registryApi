import { UUID, Email, Name, PhoneNumber } from '@app/entities/VO';
import { User } from '@app/entities/user';

export namespace UserRepoInterfaces {
	export interface search {
		safeSearch?: undefined;
		key: Email | UUID;
	}
	export interface safeSearch {
		safeSearch?: true;
		key: Email | UUID;
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
	abstract find(input: UserRepoInterfaces.search): Promise<User | undefined>;

	abstract find(input: UserRepoInterfaces.safeSearch): Promise<User>;

	abstract delete(input: UserRepoInterfaces.remove): Promise<void>;

	abstract update(input: UserRepoInterfaces.update): Promise<void>;
}
