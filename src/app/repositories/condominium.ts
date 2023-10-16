import { Condominium } from '@app/entities/condominium';

export interface ICreateCondominiumInput {
	condominium: Condominium;
}

export abstract class CondominiumRepo {
	abstract create: (input: ICreateCondominiumInput) => Promise<void>;
}
