import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { Invite } from '@app/entities/invite';
import { InviteRepo, InviteRepoInterfaces } from '@app/repositories/invite';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { InMemoryContainer } from '../inMemoryContainer';
import { User } from '@app/entities/user';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { Email } from '@app/entities/VO';
import { CommunityInfos } from '@app/entities/communityInfos';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';

export class InMemoryInvite implements InviteRepo {
	calls = {
		find: 0,
		transferToUserResources: 0,
		delete: 0,
	};
	invites: Invite[];
	users: User[];
	condominiumMembers: CondominiumMember[];
	communityInfos: CommunityInfos[];
	uniqueRegistries: UniqueRegistry[];

	constructor(container: InMemoryContainer) {
		this.invites = container.props.inviteArr;
		this.uniqueRegistries = container.props.uniqueRegistryArr;
		this.users = container.props.userArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
		this.communityInfos = container.props.communityInfosArr;
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

		const searchedUniqueRegistryIndex = this.uniqueRegistries.findIndex(
			(item) =>
				item.email.equalTo(input.rawUniqueRegistry.email) &&
				ValueObject.compare(item.CPF, input.rawUniqueRegistry.CPF),
		);
		const searchedCondominiumMemberIndex =
			this.condominiumMembers.findIndex((item) =>
				input.invite.memberId.equalTo(item.id),
			);
		const searchedCommunityInfoIndex = this.communityInfos.findIndex(
			(item) =>
				ValueObject.compare(
					item.memberId,
					this.condominiumMembers[searchedCondominiumMemberIndex]?.id,
				),
		);
		const searchedInviteIndex = this.invites.findIndex((item) =>
			item.recipient.equalTo(input.rawUniqueRegistry.email),
		);

		if (
			searchedInviteIndex < 0 ||
			searchedCommunityInfoIndex < 0 ||
			searchedCondominiumMemberIndex < 0 ||
			searchedUniqueRegistryIndex < 0
		)
			throw new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Invite or condominium member doesn\'t exist',
			});

		this.invites.splice(searchedInviteIndex, 1);
		this.users.push(input.user);
		this.condominiumMembers[searchedCondominiumMemberIndex].userId =
			input.user.id;
	}

	async delete(input: InviteRepoInterfaces.remove): Promise<void> {
		++this.calls.delete;

		const searchedInviteIndex = this.invites.findIndex((item) =>
			item.memberId.equalTo(input.key),
		);
		if (searchedInviteIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.invite,
				message: 'Invite doesn\'t exist',
			});

		this.invites.splice(searchedInviteIndex, 1);
	}
}
