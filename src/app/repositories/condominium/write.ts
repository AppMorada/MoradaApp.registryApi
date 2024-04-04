import { CEP, UUID, Name, Num } from '@app/entities/VO';
import { Condominium } from '@app/entities/condominium';

export namespace CondominiumWriteOpsInterfaces {
	export interface create {
		condominium: Condominium;
	}

	export interface update {
		id: UUID;
		isValidated?: boolean;
		name?: Name;
		CEP?: CEP;
		num?: Num;
	}

	export interface remove {
		id: UUID;
	}
}

export abstract class CondominiumRepoWriteOps {
	abstract create(input: CondominiumWriteOpsInterfaces.create): Promise<void>;
	abstract update(input: CondominiumWriteOpsInterfaces.update): Promise<void>;
	abstract remove(input: CondominiumWriteOpsInterfaces.remove): Promise<void>;
}
