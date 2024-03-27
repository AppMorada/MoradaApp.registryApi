import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { User } from '@app/entities/user';
import {
	UserRepoReadOps,
	UserRepoReadOpsInterfaces,
} from '@app/repositories/user/read';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '../../inMemoryContainer';

import { CondominiumMember } from '@app/entities/condominiumMember';
import { Invite } from '@app/entities/invite';
import { Condominium } from '@app/entities/condominium';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { Email, UUID } from '@app/entities/VO';

export class InMemoryUserReadOps implements UserRepoReadOps {
	calls = {
		find: 0,
	};
	users: User[];
	invites: Invite[];
	condominiums: Condominium[];
	uniqueRegistries: UniqueRegistry[];
	condominiumMembers: CondominiumMember[];

	constructor(container: InMemoryContainer) {
		this.users = container.props.userArr;
		this.uniqueRegistries = container.props.uniqueRegistryArr;
		this.invites = container.props.inviteArr;
		this.condominiums = container.props.condominiumArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
	}

	async find(
		input: UserRepoReadOpsInterfaces.safeSearch,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData>;
	async find(
		input: UserRepoReadOpsInterfaces.search,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData | undefined>;

	async find(
		input:
			| UserRepoReadOpsInterfaces.search
			| UserRepoReadOpsInterfaces.safeSearch,
	): Promise<UserRepoReadOpsInterfaces.searchReturnableData | undefined> {
		++this.calls.find;

		let existentUser: User | undefined;
		let uniqueRegistryData: UniqueRegistry | undefined;

		if (input.key instanceof UUID) {
			existentUser = this.users.find((item) =>
				item.id.equalTo(input.key as UUID),
			);
			uniqueRegistryData = this.uniqueRegistries.find((item) =>
				ValueObject.compare(item.id, existentUser?.uniqueRegistryId),
			);
		} else {
			uniqueRegistryData = this.uniqueRegistries.find((item) =>
				item.email.equalTo(input.key as Email),
			);
			existentUser = this.users.find((item) =>
				ValueObject.compare(
					item.uniqueRegistryId,
					uniqueRegistryData?.id,
				),
			);
		}

		if ((!existentUser || !uniqueRegistryData) && input.safeSearch)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User not found',
			});

		return !existentUser || !uniqueRegistryData
			? undefined
			: {
				user: existentUser,
				uniqueRegistry: uniqueRegistryData,
			};
	}
}
