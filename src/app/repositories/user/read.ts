import { UUID, Email } from '@app/entities/VO';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { User } from '@app/entities/user';

export namespace UserRepoReadOpsInterfaces {
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
}

export namespace UserReadOps {
	export abstract class Read {
		abstract exec(
			input: UserRepoReadOpsInterfaces.search,
		): Promise<UserRepoReadOpsInterfaces.searchReturnableData | undefined>;
		abstract exec(
			input: UserRepoReadOpsInterfaces.safeSearch,
		): Promise<UserRepoReadOpsInterfaces.searchReturnableData>;
	}
}
