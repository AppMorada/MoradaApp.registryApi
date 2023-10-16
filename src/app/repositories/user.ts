import { CPF } from '@app/entities/VO/CPF';
import { Email } from '@app/entities/VO/email';
import { User } from '@app/entities/user';

export interface ICreateUserInput {
	user: User;
}

export interface IUserSearchQuery {
	id?: string;
	email?: Email;
	CPF?: CPF;
}

export abstract class UserRepo {
	abstract create: (input: ICreateUserInput) => Promise<void>;
	abstract find: (input: IUserSearchQuery) => Promise<User | undefined>;
}
