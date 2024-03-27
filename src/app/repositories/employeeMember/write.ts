import { CPF, Email, Name, PhoneNumber, UUID } from '@app/entities/VO';
import { CondominiumMember } from '@app/entities/condominiumMember';
import { User } from '@app/entities/user';

export namespace EmployeeMemberRepoWriteOpsInterfaces {
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
}

export abstract class EmployeeMemberRepoWriteOps {
	abstract create(
		input: EmployeeMemberRepoWriteOpsInterfaces.create,
	): Promise<void>;
	abstract update(
		input: EmployeeMemberRepoWriteOpsInterfaces.update,
	): Promise<void>;
	abstract remove(
		input: EmployeeMemberRepoWriteOpsInterfaces.remove,
	): Promise<void>;
}
