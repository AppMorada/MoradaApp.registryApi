import {
	UserReadOps,
	UserRepoReadOpsInterfaces,
} from '@app/repositories/user/read';

export class InMemoryUserRead implements UserReadOps.Read {
	calls = {
		exec: 0,
	};

	async exec(
		input: UserRepoReadOpsInterfaces.safeSearch,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData>;
	async exec(
		input: UserRepoReadOpsInterfaces.search,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData | undefined>;

	async exec(): Promise<
		UserRepoReadOpsInterfaces.searchReturnableData | undefined
		> {
		++this.calls.exec;
		return undefined;
	}
}
