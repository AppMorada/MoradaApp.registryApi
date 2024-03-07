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
	abstract create(
		input: EnterpriseMemberRepoInterfaces.create,
	): Promise<void>;

	abstract getByUserId(
		input: EnterpriseMemberRepoInterfaces.getByUserId,
	): Promise<EnterpriseMember | undefined>;

	abstract getById(
		input: EnterpriseMemberRepoInterfaces.getById,
	): Promise<EnterpriseMember | undefined>;

	abstract getGroupCondominiumId(
		input: EnterpriseMemberRepoInterfaces.getByCondominiumId,
	): Promise<IUserInObject[]>;

	abstract update(
		input: EnterpriseMemberRepoInterfaces.update,
	): Promise<void>;

	abstract remove(
		input: EnterpriseMemberRepoInterfaces.remove,
	): Promise<void>;
}
