import { UUID, Name, PhoneNumber } from '@app/entities/VO';

export namespace UserRepoWriteOpsInterfaces {
	export interface remove {
		key: UUID;
	}
	export interface update {
		id: UUID;
		name?: Name;
		phoneNumber?: PhoneNumber;
	}
}

export abstract class UserRepoWriteOps {
	abstract delete(input: UserRepoWriteOpsInterfaces.remove): Promise<void>;
	abstract update(input: UserRepoWriteOpsInterfaces.update): Promise<void>;
}
