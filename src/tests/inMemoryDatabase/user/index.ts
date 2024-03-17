import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { User } from '@app/entities/user';
import { UserRepo, UserRepoInterfaces } from '@app/repositories/user';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '../inMemoryContainer';

import { CondominiumMember } from '@app/entities/condominiumMember';
import { Invite } from '@app/entities/invite';
import { Condominium } from '@app/entities/condominium';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { Email, UUID } from '@app/entities/VO';

export class InMemoryUser implements UserRepo {
	calls = {
		create: 0,
		find: 0,
		delete: 0,
		update: 0,
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
		input: UserRepoInterfaces.safeSearch,
	): Promise<UserRepoInterfaces.searchReturnableData>;
	async find(
		input: UserRepoInterfaces.search,
	): Promise<UserRepoInterfaces.searchReturnableData | undefined>;

	async find(
		input: UserRepoInterfaces.search | UserRepoInterfaces.safeSearch,
	): Promise<UserRepoInterfaces.searchReturnableData | undefined> {
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

	async delete(input: UserRepoInterfaces.remove): Promise<void> {
		++this.calls.delete;

		const existentUserIndex = this.users.findIndex((item) =>
			item.id.equalTo(input.key),
		);
		const uniqueRegistryIndex = this.uniqueRegistries.findIndex((item) =>
			ValueObject.compare(
				item.id,
				this.users[existentUserIndex]?.uniqueRegistryId,
			),
		);

		if (existentUserIndex < 0 || uniqueRegistryIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User doesn\'t exist',
			});

		this.uniqueRegistries.splice(uniqueRegistryIndex, 1);
		this.users.splice(existentUserIndex, 1);
		this.condominiumMembers = this.condominiumMembers.filter(
			(item) => item.userId?.equalTo(input.key),
		);
	}

	async update(input: UserRepoInterfaces.update): Promise<void> {
		++this.calls.update;

		const existentUserIndex = this.users.findIndex((item) =>
			item.id.equalTo(input.id),
		);

		if (existentUserIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.user,
				message: 'User doesn\'t exist',
			});

		const user = this.users[existentUserIndex];
		user.name = input?.name ?? user.name;
		user.phoneNumber = input?.phoneNumber ?? user.phoneNumber;
	}
}
