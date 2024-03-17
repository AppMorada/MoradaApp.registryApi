import { CondominiumMember } from '@app/entities/condominiumMember';
import { InMemoryContainer } from '../inMemoryContainer';
import { InMemoryError } from '@tests/errors/inMemoryError';
import { EntitiesEnum, ValueObject } from '@app/entities/entities';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import { CondominiumMemberMapper } from '@app/mapper/condominiumMember';
import { CommunityInfos } from '@app/entities/communityInfos';
import { CommunityInfoMapper } from '@app/mapper/communityInfo';
import {
	CommunityMemberRepo,
	CommunityMemberRepoInterfaces,
} from '@app/repositories/communityMember';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';
import { Invite } from '@app/entities/invite';

export class InMemoryCommunityMembers implements CommunityMemberRepo {
	calls = {
		getByUserId: 0,
		getById: 0,
		getGroupCondominiumId: 0,
		create: 0,
		createMany: 0,
		checkByUserAndCondominiumId: 0,
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

	async create(input: CommunityMemberRepoInterfaces.create): Promise<void> {
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
		input: CommunityMemberRepoInterfaces.createMany,
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

	async remove(input: CommunityMemberRepoInterfaces.remove): Promise<void> {
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

	async getById(
		input: CommunityMemberRepoInterfaces.getById,
	): Promise<CommunityMemberRepoInterfaces.getByIdReturn | undefined> {
		++this.calls.getById;
		const condominiumMember = this.condominiumMembers.find((item) =>
			ValueObject.compare(item.id, input.id),
		);
		const communityInfos = this.communityInfos.find((item) =>
			ValueObject.compare(item.memberId, condominiumMember?.id),
		);
		const uniqueRegistry = this.uniqueRegistries.find((item) =>
			ValueObject.compare(item.id, condominiumMember?.uniqueRegistryId),
		);

		return !condominiumMember || !communityInfos || !uniqueRegistry
			? undefined
			: {
				member: condominiumMember,
				communityInfos,
				uniqueRegistry,
			};
	}

	async getByUserId(
		input: CommunityMemberRepoInterfaces.getByUserId,
	): Promise<CommunityMemberRepoInterfaces.getByUserIdReturn[]> {
		++this.calls.getByUserId;
		const condominiumMembers = this.condominiumMembers.filter((item) =>
			ValueObject.compare(item.userId, input.id),
		);

		const parsedCondominiumMember: CommunityMemberRepoInterfaces.getByUserIdReturn[] =
			[];

		for (const item of condominiumMembers) {
			const rawCommunityInfo = this.communityInfos.find((infos) =>
				infos.memberId.equalTo(item.id),
			);
			const parsedCommunityInfo = rawCommunityInfo
				? CommunityInfoMapper.toObject(rawCommunityInfo)
				: undefined;

			if (!parsedCommunityInfo) continue;
			parsedCondominiumMember.push({
				member: CondominiumMemberMapper.toObject(item),
				communityInfos: parsedCommunityInfo,
			});
		}

		return parsedCondominiumMember;
	}

	async checkByUserAndCondominiumId(
		input: CommunityMemberRepoInterfaces.getByUserIdAndCondominiumId,
	): Promise<number> {
		++this.calls.checkByUserAndCondominiumId;
		let counter = 0;
		for (const item of this.condominiumMembers) {
			if (
				input.condominiumId.equalTo(item.condominiumId) &&
				ValueObject.compare(input.userId, item?.userId)
			) {
				++counter;
			}
		}
		return counter;
	}

	async getGroupCondominiumId(
		input: CommunityMemberRepoInterfaces.getByCondominiumId,
	): Promise<CommunityMemberRepoInterfaces.getByCondominiumIdReturn[]> {
		++this.calls.getGroupCondominiumId;
		const condominiumMembers = this.condominiumMembers.filter((item) =>
			ValueObject.compare(item.condominiumId, input.condominiumId),
		);

		const returnableData: CommunityMemberRepoInterfaces.getByCondominiumIdReturn[] =
			[];
		for (const item of condominiumMembers) {
			const member = CondominiumMemberMapper.toObject(item);
			const communityInfos = this.communityInfos.find((infos) =>
				infos.memberId.equalTo(item.id),
			);
			const uniqueRegistry = this.uniqueRegistries.find((registry) =>
				registry.id.equalTo(item.uniqueRegistryId),
			);

			if (!communityInfos || !uniqueRegistry) continue;

			returnableData.push({
				member,
				communityInfos: CommunityInfoMapper.toObject(communityInfos),
				uniqueRegistry: UniqueRegistryMapper.toObject(uniqueRegistry),
			});
		}

		return returnableData;
	}

	async update(input: CommunityMemberRepoInterfaces.update): Promise<void> {
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
