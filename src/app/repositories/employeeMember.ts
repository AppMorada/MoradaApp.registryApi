import { CPF, Email, Name, PhoneNumber, UUID } from '@app/entities/VO';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { User } from '@app/entities/user';
import { ICondominiumMemberInObject } from '@app/mapper/condominiumMember';
import { IUniqueRegistryInObject } from '@app/mapper/uniqueRegistry';
import { IUserInObject } from '@app/mapper/user';

export namespace EmployeeMemberRepoInterfaces {
	export interface create {
		member: CondominiumMember;
		user: User;
		rawUniqueRegistry: {
			email: Email;
			CPF: CPF;
		};
	}

	export interface remove {
		userId: UUID;
		condominiumId: UUID;
	}

	export interface update {
		userId: UUID;
		condominiumId: UUID;
		name?: Name;
		phoneNumber?: PhoneNumber;
	}

	export interface getByCondominiumId {
		condominiumId: UUID;
	}

	export interface getByCondominiumIdReturn {
		condominiumMemberInfos: ICondominiumMemberInObject;
		uniqueRegistry: IUniqueRegistryInObject;
		user: Omit<IUserInObject, 'password' | 'tfa'>;
	}

	export interface getByUserId {
		id: UUID;
	}

	export interface getByUserIdReturn {
		worksOn: ICondominiumMemberInObject[];
		uniqueRegistry: IUniqueRegistryInObject;
		user: IUserInObject;
	}
}

export abstract class EmployeeMemberRepo {
	abstract create(input: EmployeeMemberRepoInterfaces.create): Promise<void>;

	abstract getByUserId(
		input: EmployeeMemberRepoInterfaces.getByUserId,
	): Promise<EmployeeMemberRepoInterfaces.getByUserIdReturn | undefined>;

	abstract getGroupCondominiumId(
		input: EmployeeMemberRepoInterfaces.getByCondominiumId,
	): Promise<EmployeeMemberRepoInterfaces.getByCondominiumIdReturn[]>;

	abstract update(input: EmployeeMemberRepoInterfaces.update): Promise<void>;

	abstract remove(input: EmployeeMemberRepoInterfaces.remove): Promise<void>;
}
