import { CondominiumMember } from '@app/entities/condominiumMember';
import { InMemoryContainer } from '../../inMemoryContainer';
import { ValueObject } from '@app/entities/entities';
import { Condominium } from '@app/entities/condominium';
import { User } from '@app/entities/user';
import { CondominiumMemberMapper } from '@app/mapper/condominiumMember';
import { CommunityInfos } from '@app/entities/communityInfos';
import { CommunityInfoMapper } from '@app/mapper/communityInfo';
import {
	CommunityMemberRepoReadOps,
	CommunityMemberRepoReadOpsInterfaces,
} from '@app/repositories/communityMember/read';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { UniqueRegistryMapper } from '@app/mapper/uniqueRegistry';
import { Invite } from '@app/entities/invite';

export class InMemoryCommunityMembersReadOps
implements CommunityMemberRepoReadOps
{
	calls = {
		getByUserId: 0,
		getById: 0,
		getGroupCondominiumId: 0,
		checkByUserAndCondominiumId: 0,
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

	async getById(
		input: CommunityMemberRepoReadOpsInterfaces.getById,
	): Promise<CommunityMemberRepoReadOpsInterfaces.getByIdReturn | undefined> {
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
		input: CommunityMemberRepoReadOpsInterfaces.getByUserId,
	): Promise<CommunityMemberRepoReadOpsInterfaces.getByUserIdReturn[]> {
		++this.calls.getByUserId;
		const condominiumMembers = this.condominiumMembers.filter((item) =>
			ValueObject.compare(item.userId, input.id),
		);

		const parsedCondominiumMember: CommunityMemberRepoReadOpsInterfaces.getByUserIdReturn[] =
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
		input: CommunityMemberRepoReadOpsInterfaces.getByUserIdAndCondominiumId,
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
		input: CommunityMemberRepoReadOpsInterfaces.getByCondominiumId,
	): Promise<
		CommunityMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[]
	> {
		++this.calls.getGroupCondominiumId;
		const condominiumMembers = this.condominiumMembers.filter((item) =>
			ValueObject.compare(item.condominiumId, input.condominiumId),
		);

		const returnableData: CommunityMemberRepoReadOpsInterfaces.getByCondominiumIdReturn[] =
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
}
