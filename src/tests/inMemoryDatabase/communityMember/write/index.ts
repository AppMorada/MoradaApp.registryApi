import { CondominiumMember } from '@app/entities/condominiumMember';
import { InMemoryContainer } from '../../inMemoryContainer';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import { CommunityInfos } from '@app/entities/communityInfos';
import {
	CommunityMemberRepoWriteOpsInterfaces,
	CommunityMemberWriteOpsRepo,
} from '@app/repositories/communityMember/write';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { Invite } from '@app/entities/invite';

export class InMemoryCommunityMembersWriteOps
implements CommunityMemberWriteOpsRepo
{
	calls = {
		create: 0,
		createMany: 0,
		remove: 0,
		update: 0,
	};

	invites: Invite[];
	users: User[];
	condominiumMembers: CondominiumMember[];
	condominiums: Condominium[];
	communityInfos: CommunityInfos[];
	uniqueRegistries: UniqueRegistry[];

	constructor(container: InMemoryContainer) {
		this.invites = container.props.inviteArr;
		this.users = container.props.userArr;
		this.uniqueRegistries = container.props.uniqueRegistryArr;
		this.condominiumMembers = container.props.condominiumMemberArr;
		this.condominiums = container.props.condominiumArr;
		this.communityInfos = container.props.communityInfosArr;
	}

	async create(
		input: CommunityMemberRepoWriteOpsInterfaces.create,
	): Promise<void> {
		++this.calls.create;

		const member = this.condominiumMembers.find((item) =>
			input.member.id.equalTo(item.id),
		);
		const communityInfos = this.communityInfos.find((item) =>
			ValueObject.compare(item.memberId, member?.id),
		);
		const searchedInvite = this.invites.find(
			(item) =>
				item.memberId.equalTo(input.invite.memberId) ||
				(item.recipient.equalTo(input.rawUniqueRegistry.email) &&
					item.condominiumId.equalTo(input.member.condominiumId)),
		);

		if (member || communityInfos || searchedInvite)
			throw new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member already exist',
			});

		this.condominiumMembers.push(input.member);
		this.communityInfos.push(input.communityInfos);
		this.invites.push(input.invite);

		const uniqueRegistry = this.uniqueRegistries.find((item) =>
			item.email.equalTo(input.rawUniqueRegistry.email),
		);
		if (!uniqueRegistry)
			this.uniqueRegistries.push(
				new UniqueRegistry({
					email: input.rawUniqueRegistry.email.value,
					CPF: input.rawUniqueRegistry.CPF.value,
				}),
			);
	}

	async createMany(
		input: CommunityMemberRepoWriteOpsInterfaces.createMany,
	): Promise<void> {
		++this.calls.createMany;

		input.members.forEach((item) => {
			this.create({
				member: item.content,
				communityInfos: item.communityInfos,
				invite: item.invite,
				rawUniqueRegistry: item.rawUniqueRegistry,
			});
		});
	}

	async remove(
		input: CommunityMemberRepoWriteOpsInterfaces.remove,
	): Promise<void> {
		++this.calls.remove;
		const memberIndex = this.condominiumMembers.findIndex((item) =>
			item.id.equalTo(input.id),
		);
		const communityInfoIndex = this.communityInfos.findIndex((item) =>
			ValueObject.compare(
				item.memberId,
				this.condominiumMembers[memberIndex]?.id,
			),
		);
		if (memberIndex < 0 || communityInfoIndex)
			throw new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member doesn\'t exist',
			});

		this.condominiumMembers.splice(memberIndex, 1);
		this.communityInfos.splice(communityInfoIndex, 1);
	}

	async update(
		input: CommunityMemberRepoWriteOpsInterfaces.update,
	): Promise<void> {
		++this.calls.update;
		const memberIndex = this.condominiumMembers.findIndex((item) =>
			item.id.equalTo(input.id),
		);
		const communityInfosIndex = this.communityInfos.findIndex((item) =>
			ValueObject.compare(
				item.memberId,
				this.condominiumMembers[memberIndex]?.id,
			),
		);

		if (memberIndex < 0 || communityInfosIndex < 0)
			throw new InMemoryError({
				entity: EntitiesEnum.condominiumMember,
				message: 'Condominium member doesn\'t exist',
			});

		const communityInfos = this.communityInfos[communityInfosIndex];
		communityInfos.block = input.block ?? communityInfos.block;
		communityInfos.apartmentNumber =
			input.apartmentNumber ?? communityInfos.apartmentNumber;
	}
}
