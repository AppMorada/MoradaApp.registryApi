import { ApartmentNumber, Block, CPF, Email, UUID } from '@app/entities/VO';
import { CommunityInfos } from '@app/entities/communityInfos';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { Invite } from '@app/entities/invite';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { ICommunityInfoAsObject } from '@app/mapper/communityInfo';
import { ICondominiumMemberInObject } from '@app/mapper/condominiumMember';
import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';

export namespace CommunityMemberRepoInterfaces {
	export interface create {
		member: CondominiumMember;
		communityInfos: CommunityInfos;
		invite: Invite;
		rawUniqueRegistry: {
			email: Email;
			CPF: CPF;
		};
	}

	export interface createMany {
		members: {
			content: CondominiumMember;
			communityInfos: CommunityInfos;
			invite: Invite;
			rawUniqueRegistry: {
				email: Email;
				CPF: CPF;
			};
		}[];
	}

	export interface remove {
		id: UUID;
	}

	export interface update {
		id: UUID;
		apartmentNumber?: ApartmentNumber;
		block?: Block;
	}

	export interface getByCondominiumId {
		condominiumId: UUID;
	}

	export interface getByCondominiumIdReturn {
		member: ICondominiumMemberInObject;
		communityInfos: ICommunityInfoAsObject;
		uniqueRegistry: IUniqueRegistryInObject;
	}

	export interface getByUserId {
		id: UUID;
	}

	export interface getByUserIdReturn {
		member: ICondominiumMemberInObject;
		communityInfos: ICommunityInfoAsObject;
	}

	export interface getById {
		id: UUID;
	}

	export interface getByIdReturn {
		member: CondominiumMember;
		communityInfos: CommunityInfos;
		uniqueRegistry: UniqueRegistry;
	}

	export interface getByUserIdAndCondominiumId {
		userId: UUID;
		condominiumId: UUID;
	}
}

export abstract class CommunityMemberRepo {
	abstract create(input: CommunityMemberRepoInterfaces.create): Promise<void>;

	abstract createMany(
		input: CommunityMemberRepoInterfaces.createMany,
	): Promise<void>;

	abstract getByUserId(
		input: CommunityMemberRepoInterfaces.getByUserId,
	): Promise<CommunityMemberRepoInterfaces.getByUserIdReturn[]>;

	abstract getById(
		input: CommunityMemberRepoInterfaces.getById,
	): Promise<CommunityMemberRepoInterfaces.getByIdReturn | undefined>;

	abstract getGroupCondominiumId(
		input: CommunityMemberRepoInterfaces.getByCondominiumId,
	): Promise<CommunityMemberRepoInterfaces.getByCondominiumIdReturn[]>;

	abstract checkByUserAndCondominiumId(
		input: CommunityMemberRepoInterfaces.getByUserIdAndCondominiumId,
	): Promise<number>;

	abstract update(input: CommunityMemberRepoInterfaces.update): Promise<void>;

	abstract remove(input: CommunityMemberRepoInterfaces.remove): Promise<void>;
}
