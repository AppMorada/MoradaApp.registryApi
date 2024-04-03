import { UUID, Name, PhoneNumber } from '@app/entities/VO';
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
	}
	export interface create {
		user: User;
		uniqueRegistry: UniqueRegistry;
	}
	export interface createReturn {
		affectedCondominiumMembers?: number;
	}
}

export abstract class UserRepoWriteOps {
	abstract create(
		input: UserRepoWriteOpsInterfaces.create,
	): Promise<UserRepoWriteOpsInterfaces.createReturn>;
	abstract delete(input: UserRepoWriteOpsInterfaces.remove): Promise<void>;
	abstract update(input: UserRepoWriteOpsInterfaces.update): Promise<void>;
}
