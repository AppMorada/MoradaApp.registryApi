import { UUID, Name, PhoneNumber, Password } from '@app/entities/VO';
import { UniqueRegistry } from '@app/entities/uniqueRegistry';
import { User } from '@app/entities/user';

export namespace UserRepoWriteOpsInterfaces {
	export interface remove {
		key: UUID;
	}
	export interface update {
		id: UUID;
		name?: Name;
		phoneNumber?: PhoneNumber;
		password?: Password;
	}
	export interface create {
		user: User;
		uniqueRegistry: UniqueRegistry;
	}
	export interface createReturn {
		affectedCondominiumMembers?: number;
	}
}

export namespace UserWriteOps {
	export abstract class Create {
		abstract exec(
			input: UserRepoWriteOpsInterfaces.create,
		): Promise<UserRepoWriteOpsInterfaces.createReturn>;
	}

	export abstract class Delete {
		abstract exec(input: UserRepoWriteOpsInterfaces.remove): Promise<void>;
	}

	export abstract class Update {
		abstract exec(input: UserRepoWriteOpsInterfaces.update): Promise<void>;
	}
}
