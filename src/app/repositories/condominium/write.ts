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
import { User } from '@app/entities/user';

export namespace CondominiumWriteOpsInterfaces {
	export interface create {
		condominium: Condominium;
		user: User;
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

export namespace CondominiumWriteOps {
	export abstract class Remove {
		abstract exec(
			input: CondominiumWriteOpsInterfaces.remove,
		): Promise<void>;
	}

	export abstract class Create {
		abstract exec(
			input: CondominiumWriteOpsInterfaces.create,
		): Promise<void>;
	}

	export abstract class Update {
		abstract exec(
			input: CondominiumWriteOpsInterfaces.update,
		): Promise<void>;
	}
}
