import { UUID, Email, CPF } from '@app/entities/VO';
import { Invite } from '@app/entities/invite';
import { User } from '@app/entities/user';

export namespace InviteRepoInterfaces {
	export interface create {
		invite: Invite;
	}
	export interface find {
		key: Email;
		safeSearch: undefined;
	}
	export interface safelyFind {
		key: Email;
		safeSearch?: true;
	}
	export interface remove {
		key: UUID;
	}
	export interface transferToUserResources {
		user: User;
		invite: Invite;
		CPF: CPF;
	}
}

export abstract class InviteRepo {
	abstract create(input: InviteRepoInterfaces.create): Promise<void>;

	abstract find(input: InviteRepoInterfaces.find): Promise<Invite[]>;

	abstract find(input: InviteRepoInterfaces.safelyFind): Promise<Invite[]>;

	abstract transferToUserResources(
		input: InviteRepoInterfaces.transferToUserResources,
	): Promise<void>;

	abstract delete(input: InviteRepoInterfaces.remove): Promise<void>;
}
