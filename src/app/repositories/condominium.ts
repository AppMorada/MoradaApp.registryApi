import { CEP } from '@app/entities/VO/CEP';
import { CNPJ } from '@app/entities/VO/CNPJ';
import { Name } from '@app/entities/VO/name';
import { Condominium } from '@app/entities/condominium';

export interface ICreateCondominiumInput {
	condominium: Condominium;
}

export interface ICondominiumSearchQuery {
	id?: string;
	CNPJ?: CNPJ;
	CEP?: CEP;
	name?: Name;
}

export abstract class CondominiumRepo {
	abstract create: (input: ICreateCondominiumInput) => Promise<void>;
	abstract find: (
		input: ICondominiumSearchQuery,
	) => Promise<Condominium | undefined>;
}
