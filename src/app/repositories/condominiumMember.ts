import { ApartmentNumber, Block, CPF, Email, UUID } from '@app/entities/VO';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { ICondominiumMemberInObject } from '@app/mapper/condominiumMember';

export namespace CondominiumMemberRepoInterfaces {
	export interface create {
		member: CondominiumMember;
	}

	export interface createMany {
		members: {
			content: CondominiumMember;
		}[];
	}

	export interface remove {
		id: UUID;
	}

	export interface update {
		id: UUID;
		c_email?: Email;
		apartmentNumber?: ApartmentNumber;
		CPF?: CPF;
		block?: Block;
	}

	export interface getByCondominiumId {
		condominiumId: UUID;
	}

	export interface getByCondominiumIdReturn {
		id: string;
		userId: string | null;
		c_email: string;
		block: string | null;
		CPF: string;
		apartmentNumber: number | null;
		createdAt: Date;
		updatedAt: Date;
	}

	export interface getByUserId {
		id: UUID;
	}

	export interface getById {
		id: UUID;
	}

	export interface getByUserIdAndCondominiumId {
		userId: UUID;
		condominiumId: UUID;
	}
}

export abstract class CondominiumMemberRepo {
	abstract create(
		input: CondominiumMemberRepoInterfaces.create,
	): Promise<void>;

	abstract createMany(
		input: CondominiumMemberRepoInterfaces.createMany,
	): Promise<void>;

	abstract getByUserId(
		input: CondominiumMemberRepoInterfaces.getByUserId,
	): Promise<ICondominiumMemberInObject[]>;

	abstract getById(
		input: CondominiumMemberRepoInterfaces.getById,
	): Promise<CondominiumMember | undefined>;

	abstract getGroupCondominiumId(
		input: CondominiumMemberRepoInterfaces.getByCondominiumId,
	): Promise<CondominiumMemberRepoInterfaces.getByCondominiumIdReturn[]>;

	abstract checkByUserAndCondominiumId(
		input: CondominiumMemberRepoInterfaces.getByUserIdAndCondominiumId,
	): Promise<number>;

	abstract update(
		input: CondominiumMemberRepoInterfaces.update,
	): Promise<void>;

	abstract remove(
		input: CondominiumMemberRepoInterfaces.remove,
	): Promise<void>;
}
