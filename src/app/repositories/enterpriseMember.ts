import { CPF, Name, PhoneNumber, UUID } from '@app/entities/VO';
import { EnterpriseMember } from '@app/entities/enterpriseMember';
import { User } from '@app/entities/user';
import { IUserInObject } from '@app/mapper/user';

export namespace EnterpriseMemberRepoInterfaces {
	export interface create {
		member: EnterpriseMember;
		user: User;
	}

	export interface remove {
		id: UUID;
	}

	export interface update {
		id: UUID;
		name?: Name;
		CPF?: CPF;
		phoneNumber?: PhoneNumber;
	}

	export interface getByCondominiumId {
		condominiumId: UUID;
	}

	export interface getByUserId {
		id: UUID;
	}

	export interface getById {
		id: UUID;
	}
}

export abstract class EnterpriseMemberRepo {
	/** @virtual */
	abstract create(
		input: EnterpriseMemberRepoInterfaces.create,
	): Promise<void>;

	/** @virtual */
	abstract getByUserId(
		input: EnterpriseMemberRepoInterfaces.getByUserId,
	): Promise<EnterpriseMember | undefined>;

	/** @virtual */
	abstract getById(
		input: EnterpriseMemberRepoInterfaces.getById,
	): Promise<EnterpriseMember | undefined>;

	/** @virtual */
	abstract getGroupCondominiumId(
		input: EnterpriseMemberRepoInterfaces.getByCondominiumId,
	): Promise<IUserInObject[]>;

	/** @virtual */
	abstract update(
		input: EnterpriseMemberRepoInterfaces.update,
	): Promise<void>;

	/** @virtual */
	abstract remove(
		input: EnterpriseMemberRepoInterfaces.remove,
	): Promise<void>;
}
