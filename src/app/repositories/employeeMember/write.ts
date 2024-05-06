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

export namespace EmployeeMemberWriteOps {
	export abstract class Create {
		abstract exec(
			input: EmployeeMemberRepoWriteOpsInterfaces.create,
		): Promise<void>;
	}

	export abstract class Update {
		abstract exec(
			input: EmployeeMemberRepoWriteOpsInterfaces.update,
		): Promise<void>;
	}

	export abstract class Remove {
		abstract exec(
			input: EmployeeMemberRepoWriteOpsInterfaces.remove,
		): Promise<void>;
	}
}
