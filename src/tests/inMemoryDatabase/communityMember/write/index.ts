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

	async acceptRequest(): Promise<void> {}

	async createMany(
		input: CommunityMemberRepoWriteOpsInterfaces.createMany,
	): Promise<void> {
		++this.calls.createMany;

		input.members.forEach((member) => {
			const searchedMember = this.condominiumMembers.find((item) =>
				item.id.equalTo(member.content.id),
			);
			const communityInfos = this.communityInfos.find((item) =>
				item.memberId.equalTo(member.content.id),
			);
			const searchedInvite = this.invites.find(
				(item) =>
					item.memberId.equalTo(member.invite.memberId) ||
					(item.recipient.equalTo(member.rawUniqueRegistry.email) &&
						item.condominiumId.equalTo(
							member.content.condominiumId,
						)),
			);

			if (searchedMember || communityInfos || searchedInvite)
				throw new InMemoryError({
					entity: EntitiesEnum.condominiumMember,
					message: 'Condominium member already exist',
				});

			this.condominiumMembers.push(member.content);
			this.communityInfos.push(member.communityInfos);
			this.invites.push(member.invite);

			const uniqueRegistry = this.uniqueRegistries.find((item) =>
				item.email.equalTo(member.rawUniqueRegistry.email),
			);
			if (!uniqueRegistry)
				this.uniqueRegistries.push(
					new UniqueRegistry({
						email: member.rawUniqueRegistry.email.value,
						CPF: member.rawUniqueRegistry.CPF.value,
					}),
				);
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
