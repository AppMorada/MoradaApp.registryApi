import { EntitiesEnum } from '@app/entities/entities';
import { Invite } from '@app/entities/invite';
import { InviteRepo, InviteRepoInterfaces } from '@app/repositories/invite';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '../inMemoryContainer';
import { User } from '@app/entities/user';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { Email } from '@app/entities/VO';

export class InMemoryInvite implements InviteRepo {
	public calls = {
		create: 0,
		find: 0,
		transferToUserResources: 0,
		delete: 0,
	};
	public invites: Invite[];
	public users: User[];
	public condominiumMembers: CondominiumMember[];

	constructor(container: InMemoryContainer) {
		this.invites = container.props.inviteArr;
		this.users = container.props.userArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
	}

	async create(input: InviteRepoInterfaces.create): Promise<void> {
		++this.calls.create;

		const searchedInvite = this.invites.find((item) =>
			item.id.equalTo(input.invite.id),
		);
		const searchedMember = this.condominiumMembers.find((item) =>
			item.id.equalTo(input.invite.memberId),
		);
		if (searchedInvite || searchedMember)
			throw new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite already exist',
			});

		const member = this.condominiumMembers.find((item) =>
			item.condominiumId.equalTo(input.invite.condominiumId),
		);

		if (member)
			throw new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'User is already linked in one condominium',
			});

		this.invites.push(input.invite);
	}

	async find(input: InviteRepoInterfaces.safelyFind): Promise<Invite[]>;
	async find(input: InviteRepoInterfaces.find): Promise<Invite[]>;

	async find(
		input: InviteRepoInterfaces.safelyFind | InviteRepoInterfaces.find,
	): Promise<Invite[]> {
		++this.calls.find;

		const searchedInvites = this.invites.filter(
			(item) =>
				input.key instanceof Email && item.recipient.equalTo(input.key),
		);

		if (searchedInvites.length <= 0 && input.safeSearch)
			throw new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite not found',
			});

		return searchedInvites;
	}

	async transferToUserResources(
		input: InviteRepoInterfaces.transferToUserResources,
	): Promise<void> {
		++this.calls.transferToUserResources;

		const searchedInviteIndex = this.invites.findIndex((item) =>
			item.recipient.equalTo(input.user.email),
		);
		if (searchedInviteIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite doesn\'t exist',
			});

		let searchedCondominiumMemberIndex = this.condominiumMembers.findIndex(
			(item) =>
				item.condominiumId.equalTo(input.invite.condominiumId) ||
				item.userId?.equalTo(input.user.id),
		);
		if (searchedCondominiumMemberIndex < 0)
			searchedCondominiumMemberIndex =
				this.condominiumMembers.push(
					new CondominiumMember({
						condominiumId: input.invite.condominiumId.value,
						userId: input.user.id.value,
						autoEdit: false,
						CPF: input.CPF.value,
						c_email: input.user.email.value,
					}),
				) - 1;

		this.invites.splice(searchedInviteIndex, 1);
		this.users.push(input.user);
		this.condominiumMembers[searchedCondominiumMemberIndex].userId =
			input.user.id;
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
