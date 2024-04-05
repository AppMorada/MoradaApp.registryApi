import {
	CEP,
	UUID,
	Name,
	Num,
	District,
	City,
	State,
	Reference,
	Complement,
} from '@app/entities/VO';
import { Condominium } from '@app/entities/condominium';

export namespace CondominiumWriteOpsInterfaces {
	export interface create {
		condominium: Condominium;
	}

	export interface update {
		id: UUID;
		name?: Name;
		CEP?: CEP;
		district?: District;
		city?: City;
		state?: State;
		reference?: Reference;
		complement?: Complement;
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
