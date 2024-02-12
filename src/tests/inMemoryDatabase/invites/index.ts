import { EntitiesEnum } from '@app/entities/entities';
import { Invite } from '@app/entities/invite';
import { InviteRepo, InviteRepoInterfaces } from '@app/repositories/invite';
import { InMemoryError } from '@tests/errors/inMemoryError';
import {
	IInMemoryUserContainer,
	InMemoryContainer,
} from '../inMemoryContainer';

export class InMemoryInvite implements InviteRepo {
	public calls = {
		create: 0,
		find: 0,
		transferToUserResources: 0,
		delete: 0,
	};
	public invites: Invite[];
	public users: IInMemoryUserContainer[];

	constructor(container: InMemoryContainer) {
		this.invites = container.props.inviteArr;
		this.users = container.props.userArr;
	}

	async create(input: InviteRepoInterfaces.create): Promise<void> {
		++this.calls.create;

		const searchedInvite = this.invites.find(
			(item) => item.id === input.invite.id,
		);
		if (searchedInvite)
			throw new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite already exist',
			});

		const searchedCondominiumRelUser = this.users.find(
			(item) =>
				item.user.condominiumRelUser[input.invite.condominiumId.value],
		);

		if (searchedCondominiumRelUser)
			throw new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'User is already linked in one condominium',
			});

		this.invites.push(input.invite);
	}

	async find(input: InviteRepoInterfaces.safelyFind): Promise<Invite>;
	async find(input: InviteRepoInterfaces.find): Promise<Invite | undefined>;

	async find(
		input: InviteRepoInterfaces.safelyFind | InviteRepoInterfaces.find,
	): Promise<Invite | undefined> {
		++this.calls.find;

		const searchedInvite = this.invites.find((item) =>
			item.email.equalTo(input.key),
		);

		if (!searchedInvite && input.safeSearch)
			throw new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite not found',
			});

		return searchedInvite;
	}

	async transferToUserResources(
		input: InviteRepoInterfaces.transferToUserResources,
	): Promise<void> {
		++this.calls.transferToUserResources;

		const searchedInviteIndex = this.invites.findIndex((item) =>
			item.email.equalTo(input.user.email),
		);
		if (searchedInviteIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite doesn\'t exist',
			});

		this.invites.splice(searchedInviteIndex, 1);
		this.users.push({
			user: {
				content: input.user,
				condominiumRelUser: {
					[input.condominiumRelUser.condominiumId.value]:
						input.condominiumRelUser,
				},
			},
		});
	}

	async delete(input: InviteRepoInterfaces.remove): Promise<void> {
		++this.calls.delete;

		const searchedInviteIndex = this.invites.findIndex((item) =>
			item.id.equalTo(input.key),
		);
		if (searchedInviteIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite doesn\'t exist',
			});

		this.invites.splice(searchedInviteIndex, 1);
	}
}
