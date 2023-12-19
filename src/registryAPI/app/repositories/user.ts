import { CPF } from '@registry:app/entities/VO/CPF';
import { Email } from '@registry:app/entities/VO/email';
import { User } from '@registry:app/entities/user';

export interface ICreateUserInput {
	user: User;
}

export interface IUserSearchQuery {
	id?: string;
	email?: Email;
	CPF?: CPF;
}

export interface IDeleteUserParameters {
	id?: string;
	email?: Email;
}

export abstract class UserRepo {
	abstract create: (input: ICreateUserInput) => Promise<void>;
	abstract find: (input: IUserSearchQuery) => Promise<User | undefined>;
	abstract delete: (input: IDeleteUserParameters) => Promise<void>;
}
