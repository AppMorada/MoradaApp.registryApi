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

export class InMemoryCommunityMembersReadOps
implements CommunityMemberRepoReadOps
{
	calls = {
		getByUserId: 0,
		getById: 0,
		getGroupCondominiumId: 0,
		getByUserAndCondominiumId: 0,
	};

	users: User[];
	condominiumMembers: CondominiumMember[];
	condominiums: Condominium[];
	communityInfos: CommunityInfos[];
	uniqueRegistries: UniqueRegistry[];

	constructor(container: InMemoryContainer) {
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

		if (!condominiumMember || !communityInfos || !uniqueRegistry)
			return undefined;

		const condominiumMemberParsed = CondominiumMemberMapper.toObject(
			condominiumMember,
		) as any;
		delete condominiumMemberParsed.uniqueRegistryId;

		const communityInfosParsed = CommunityInfoMapper.toObject(
			communityInfos,
		) as any;
		delete communityInfosParsed.memberId;

		return {
			member: condominiumMemberParsed,
			communityInfos: communityInfosParsed,
			uniqueRegistry: UniqueRegistryMapper.toObject(uniqueRegistry),
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
				? (CommunityInfoMapper.toObject(rawCommunityInfo) as any)
				: undefined;
			delete parsedCommunityInfo?.memberId;

			const memberParsed = CondominiumMemberMapper.toObject(item) as any;
			delete memberParsed.userId;
			delete memberParsed.uniqueRegistryId;

			if (!parsedCommunityInfo) continue;
			parsedCondominiumMember.push({
				member: memberParsed,
				communityInfos: parsedCommunityInfo,
			});
		}

		return parsedCondominiumMember;
	}

	async getByUserAndCondominiumId(
		input: CommunityMemberRepoReadOpsInterfaces.getByUserIdAndCondominiumId,
	): Promise<
		| CommunityMemberRepoReadOpsInterfaces.getByUserIdAndCondominiumIdReturn
		| undefined
	> {
		++this.calls.getByUserAndCondominiumId;

		const condominiumMember = this.condominiumMembers.find(
			(item) =>
				ValueObject.compare(item.userId, input.userId) &&
				ValueObject.compare(item.condominiumId, input.condominiumId) &&
				item.role.value === 0,
		) as any;
		const communityInfos = this.communityInfos.find((item) =>
			ValueObject.compare(item.memberId, condominiumMember?.id),
		) as any;

		if (!condominiumMember || !communityInfos) return undefined;

		delete condominiumMember.uniqueRegistryId;
		delete communityInfos.memberId;

		return {
			member: condominiumMember,
			communityInfos,
		};
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
			const member = CondominiumMemberMapper.toObject(item) as any;
			delete member.uniqueRegistryId;

			const communityInfos = this.communityInfos.find((infos) =>
				infos.memberId.equalTo(item.id),
			);

			const uniqueRegistry = this.uniqueRegistries.find((registry) =>
				registry.id.equalTo(item.uniqueRegistryId),
			);

			if (!communityInfos || !uniqueRegistry) continue;

			const parsedCommunityInfos = CommunityInfoMapper.toObject(
				communityInfos,
			) as any;
			delete parsedCommunityInfos?.memberId;

			returnableData.push({
				member,
				communityInfos: parsedCommunityInfos,
				uniqueRegistry: UniqueRegistryMapper.toObject(uniqueRegistry),
			});
		}

		return returnableData;
	}
}
